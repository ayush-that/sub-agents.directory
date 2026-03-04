"use client";

import { AdCard } from "@/components/ad-card";
import { AdCardSmall } from "@/components/ad-card-small";
import { RuleCard } from "@/components/rule-card";
import { RuleCardSmall } from "@/components/rule-card-small";
import { Button } from "@/components/ui/button";
import { ads } from "@/data/ads";
import { sections as staticSections } from "@/data/rules/client";
import type { Section } from "@/data/rules/types";
import { useQueryState } from "nuqs";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";

const ITEMS_PER_PAGE = 6;
const SCROLL_DEBOUNCE_MS = 150;

export function RuleList({
  sections = staticSections,
  small,
}: {
  sections?: Section[];
  small?: boolean;
}) {
  const [search] = useQueryState("q");
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hashScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const visibleItemsRef = useRef(visibleItems);
  const isLoadingRef = useRef(false);
  const sectionsRef = useRef(sections);

  const sectionsKey = useMemo(() => sections.map((s) => s.slug).join(","), [sections]);

  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  const randomAds = useMemo(() => {
    const adsMap: Record<string, (typeof ads)[0]> = {};
    sections.forEach((section, sectionIndex) => {
      section.rules.forEach((_, ruleIndex) => {
        const position = `${sectionIndex}-${ruleIndex}`;
        const hash = (sectionIndex * 31 + ruleIndex * 17) % ads.length;
        adsMap[position] = ads[hash];
      });
    });
    return adsMap;
  }, [sections]);

  const filteredSections = useMemo(() => {
    const searchLower = search?.toLowerCase() || "";
    return sections
      .map((section) => ({
        ...section,
        rules: section.rules.filter(
          (rule) =>
            !search ||
            rule.title.toLowerCase().includes(searchLower) ||
            rule.description.toLowerCase().includes(searchLower),
        ),
      }))
      .filter((section) => section.rules.length > 0);
  }, [sections, search]);

  useEffect(() => {
    visibleItemsRef.current = visibleItems;
  }, [visibleItems]);

  const filteredSectionsLengthRef = useRef(filteredSections.length);
  useEffect(() => {
    filteredSectionsLengthRef.current = filteredSections.length;
  }, [filteredSections.length]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setVisibleItems(ITEMS_PER_PAGE);
    visibleItemsRef.current = ITEMS_PER_PAGE;
  }, [search]);

  useEffect(() => {
    const scrollToHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (!hash) return;

      const currentSections = sectionsRef.current;
      const sectionIndex = currentSections.findIndex((s) => s.slug === hash);
      if (sectionIndex === -1) return;

      if (sectionIndex >= visibleItemsRef.current) {
        setVisibleItems(sectionIndex + 1);
        visibleItemsRef.current = sectionIndex + 1;
      }

      if (hashScrollTimeoutRef.current) {
        clearTimeout(hashScrollTimeoutRef.current);
      }

      hashScrollTimeoutRef.current = setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 56,
            behavior: "smooth",
          });
        }
      }, 100);
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      window.removeEventListener("hashchange", scrollToHash);
      if (hashScrollTimeoutRef.current) {
        clearTimeout(hashScrollTimeoutRef.current);
      }
    };
  }, [sectionsKey]);

  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (isLoadingRef.current) return;

      const bottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight - 100;

      const currentVisible = visibleItemsRef.current;
      const totalSections = filteredSectionsLengthRef.current;

      if (bottom && currentVisible < totalSections) {
        isLoadingRef.current = true;
        setIsLoading(true);

        const newVisible = Math.min(currentVisible + ITEMS_PER_PAGE, totalSections);
        visibleItemsRef.current = newVisible;
        setVisibleItems(newVisible);

        setTimeout(() => {
          isLoadingRef.current = false;
          setIsLoading(false);
        }, 100);
      }
    }, SCROLL_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  const getRandomAd = useCallback(
    (sectionIndex: number, ruleIndex: number) => {
      const position = `${sectionIndex}-${ruleIndex}`;
      return randomAds[position] || ads[0];
    },
    [randomAds],
  );

  let totalItemsCount = 0;

  if (!filteredSections.length) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex-col gap-4 flex items-center">
          <p className="text-muted-foreground text-sm">No rules found</p>
          <p className="text-muted-foreground/60 text-xs text-center max-w-xs">
            Try a different search term or browse categories from the menu
          </p>
          <Button
            variant="outline"
            className="mt-2 border-border rounded-full"
            onClick={() => window.history.pushState({}, "", window.location.pathname)}
          >
            Clear search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {filteredSections.slice(0, visibleItems).map((section, idx) => (
        <section key={section.slug} id={section.slug}>
          <h3 className="text-lg font-regular mb-4">{section.tag}</h3>
          <div
            className={`grid grid-cols-1 gap-6 mb-8 ${
              small ? "lg:grid-cols-4" : "lg:grid-cols-2 xl:grid-cols-3"
            }`}
          >
            {section.rules.map((rule, idx2) => {
              totalItemsCount++;
              const shouldShowAd =
                totalItemsCount % 9 === 2 ||
                (totalItemsCount > 2 && (totalItemsCount - 2) % 9 === 0);

              return (
                <Fragment key={`${section.slug}-${rule.slug}`}>
                  {small ? (
                    <>
                      <RuleCardSmall rule={rule} small />
                      {isMounted && shouldShowAd && (
                        <AdCardSmall ad={getRandomAd(idx, idx2)} small />
                      )}
                    </>
                  ) : (
                    <>
                      <RuleCard rule={rule} />
                      {isMounted && shouldShowAd && <AdCard ad={getRandomAd(idx, idx2)} />}
                    </>
                  )}
                </Fragment>
              );
            })}
          </div>
        </section>
      ))}

      {visibleItems < filteredSections.length && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={() => {
              if (isLoading) return;
              const newVisible = Math.min(visibleItems + ITEMS_PER_PAGE, filteredSections.length);
              visibleItemsRef.current = newVisible;
              setVisibleItems(newVisible);
            }}
            className="px-4 py-2 text-sm text-muted-foreground"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}
