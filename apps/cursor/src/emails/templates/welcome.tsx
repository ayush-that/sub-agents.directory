import { Footer } from "@/emails/components/footer";
import { Logo } from "@/emails/components/logo";
import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export default function WelcomeEmail({
  name = "there",
}: {
  name: string;
}) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Geist Mono"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@500&display=swap",
            format: "woff2",
          }}
          fontWeight={500}
          fontStyle="normal"
        />
      </Head>
      <Preview>
        Welcome to Cursor Directory – the home for everything Cursor!
      </Preview>
      <Tailwind>
        <Body className="bg-white font-mono">
          <Container className="mx-auto py-5 pb-12 max-w-[580px]">
            <Logo />

            <Text className="text-xs leading-7 mb-6 font-mono">Hi {name},</Text>

            <Text className="text-xs leading-7 pb-2 font-mono">
              Welcome to Cursor Directory – the home for everything Cursor!
            </Text>

            <Text className="text-xs leading-7 pb-4 font-mono">
              Here, you'll find a thriving community of developers, creators,
              and enthusiasts exploring and pushing the limits of Cursor.
              Whether you're here to discover new tools, share insights, or find
              opportunities, you're in the right place.
            </Text>

            <Text className="text-xs leading-7 pb-2 font-mono">
              Here's what you can do in Cursor Directory:
            </Text>

            <Text className="text-xs font-mono">
              <span className="text-lg">◇ </span>
              <Link
                href="https://cursor.directory/rules"
                className="underline text-black font-mono"
              >
                Explore Cursor Rules
              </Link>{" "}
              – Browse existing rules or generate your own based on your needs
            </Text>

            <Text className="text-xs font-mono">
              <span className="text-lg">◇ </span>
              <Link
                href="https://cursor.directory/board"
                className="underline text-black font-mono"
              >
                Stay updated with the Board
              </Link>{" "}
              – Post, follow, and engage with the latest Cursor-related
              discussions
            </Text>

            <Text className="text-xs font-mono">
              <span className="text-lg">◇ </span>
              <Link
                href="https://cursor.directory/mcp"
                className="underline text-black font-mono"
              >
                Dive into MCPs
              </Link>{" "}
              – Discover and contribute to the growing MCP ecosystem
            </Text>

            <Text className="text-xs font-mono">
              <span className="text-lg">◇ </span>
              <Link
                href="https://cursor.directory/learn"
                className="underline text-black font-mono"
              >
                Learn & Level Up
              </Link>{" "}
              – Watch videos, read guides, and master Cursor with in-depth
              learning resources
            </Text>

            <Text className="text-xs leading-7 mt-4 font-mono">
              Cursor Directory is more than just a platform – it's a community.
              Connect with like-minded developers, share your knowledge, and be
              part of the movement.
            </Text>

            <Section className="mt-2">
              <Text className="text-xs leading-7 mb-6 font-mono">
                Jump in and start exploring:{" "}
                <Link
                  href="https://cursor.directory"
                  className="underline text-black font-mono"
                >
                  cursor.directory
                </Link>
              </Text>
            </Section>

            <Text className="text-xs leading-7 font-mono">
              Looking forward to seeing what you create!
            </Text>

            <Text className="text-xs leading-7 mt-2 font-mono">
              Best,
              <br />
              <Link
                href="https://twitter.com/pontusab"
                className="text-black font-mono text-xs leading-7 underline"
              >
                @Pontus
              </Link>{" "}
              &{" "}
              <Link
                href="https://twitter.com/viktorhofte"
                className="text-black font-mono text-xs leading-7 underline"
              >
                @Viktor
              </Link>
            </Text>

            <Footer />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
