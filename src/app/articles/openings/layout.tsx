export default function OpeningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-20 flex flex-row-reverse gap-5 justify-center">
      <div className="hidden md:flex flex-col min-w-1/4 items-end">
        <h5>Table Of Contents!</h5>
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
