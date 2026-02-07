"use client";

import ReactMarkdown from "react-markdown";

export function RepoReadme({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => (
          <p className="mb-4 leading-relaxed text-[var(--apple-text)]">{children}</p>
        ),
        h1: ({ children }) => (
          <h1 className="mb-4 mt-8 text-xl font-bold text-[var(--apple-text)]">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-3 mt-6 text-lg font-semibold text-[var(--apple-text)]">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 mt-4 text-base font-semibold text-[var(--apple-text)]">{children}</h3>
        ),
        ul: ({ children }) => (
          <ul className="mb-4 list-disc space-y-1 pl-6 text-[var(--apple-text-secondary)]">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-4 list-decimal space-y-1 pl-6 text-[var(--apple-text-secondary)]">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        a: ({ href, children }) => (
          <a
            href={href}
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-[var(--apple-link)] underline hover:no-underline"
          >
            {children}
          </a>
        ),
        code: ({ className, children, ...rest }) => {
          const isBlock = className?.includes("language-");
          if (isBlock) {
            return (
              <pre className="mb-4 overflow-x-auto rounded-lg bg-black/5 p-4 dark:bg-white/5">
                <code className="text-sm" {...rest}>
                  {children}
                </code>
              </pre>
            );
          }
          return (
            <code
              className="rounded bg-black/5 px-1.5 py-0.5 text-sm dark:bg-white/10"
              {...rest}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
