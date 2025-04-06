export default function OpeningLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="md:px-20 pt-5 pb-20">{children}</div>;
}
