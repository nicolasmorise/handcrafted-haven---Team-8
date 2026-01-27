export default function Footer() {
  return (
    <footer className="mt-auto w-full bg-[#7A9B76]">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm black">
        <p>
          © {new Date().getFullYear()} Handcrafted Haven. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
