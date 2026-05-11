export default function Footer() {
  return (
    <footer className="mt-10 border-t bg-white py-6 text-center text-gray-500">
      <p>&copy; {new Date().getFullYear()} IshantLearn</p>
      <p className="mt-1 text-sm">Built for learning Math + CS</p>
    </footer>
  );
}
