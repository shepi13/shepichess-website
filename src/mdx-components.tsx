import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children }) => (
            <h1 className="main-heading text-center">{children}</h1>
        ),
        h2: ({ children }) => <h2 className="main-heading">{children}</h2>,
        ...components,
    };
}
