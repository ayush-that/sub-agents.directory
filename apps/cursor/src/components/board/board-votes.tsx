"use client";

import { votePostAction } from "@/actions/vote-post-action";
import { SignInModal } from "@/components/modals/sign-in-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isAuthenticated as isAuthenticatedClient } from "@/utils/supabase/client-session";
import { useOptimisticAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

export function BoardVotes({
  votes,
  postId,
  hasVoted,
}: { votes: number; postId: number; hasVoted: boolean }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  useEffect(() => {
    setIsAuthenticated(isAuthenticatedClient());
  }, []);

  const { execute, optimisticState } = useOptimisticAction(votePostAction, {
    currentState: {
      votes,
      hasVoted,
    },
    updateFn: (currentState, { action }) =>
      action === "upvote"
        ? {
            votes: currentState.votes + 1,
            hasVoted: !currentState.hasVoted,
          }
        : { votes: currentState.votes - 1, hasVoted: !currentState.hasVoted },
  });

  const handleVote = () => {
    if (!isAuthenticated) {
      setIsSignInModalOpen(true);
      return;
    }

    execute({
      postId,
      action: hasVoted ? "downvote" : "upvote",
    });
  };

  return (
    <div className="flex items-center gap-2 ml-4">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleVote}
        className={cn(
          "flex items-center gap-2 h-8 px-4 rounded-full hover:text-primary",
          optimisticState.hasVoted
            ? "bg-[#1D1D1D] text-secondary dark:bg-primary dark:text-secondary"
            : "bg-gray-50 hover:bg-[#1D1D1D] text-gray-500 dark:bg-[#1D1D1D] dark:hover:bg-[#2D2D2D] dark:text-[#878787]",
        )}
      >
        <span className="text-xs font-mono">
          {optimisticState.votes ?? votes}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={12}
          height={13}
          fill="none"
        >
          <mask width={12} height={13}>
            <path
              d="M0 .5h12v12H0z"
              className={cn(
                "fill-[#878787]",
                optimisticState.hasVoted && "fill-secondary",
              )}
            />
          </mask>
          <g mask="url(#a)">
            <path
              className={cn(
                "fill-[#878787]",
                optimisticState.hasVoted && "fill-secondary",
              )}
              d="M1.452 10.25 6 2.97l4.548 7.279H1.452ZM2.8 9.5h6.4L6 4.375 2.8 9.5Z"
            />
          </g>
        </svg>
      </Button>

      <SignInModal
        isOpen={isSignInModalOpen}
        setIsOpen={setIsSignInModalOpen}
        redirectTo="/board"
      />
    </div>
  );
}
