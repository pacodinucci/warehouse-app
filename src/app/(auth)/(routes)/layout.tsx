export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200 to-green-800">
      <h1 className="text-6xl font-semibold text-white drop-shadow-md">
        🔩 Depósito 🛠️
      </h1>
      {children}
    </div>
  );
}
