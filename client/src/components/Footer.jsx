export default function Footer() {
  return (
    <footer className="footer">
      <p>
        🛒 <strong>FreshCart</strong> — Fresh groceries, delivered to your door.
        Built with ❤️ using React & Node.js
      </p>
      <p style={{ marginTop: 6, fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} FreshCart. All rights reserved.
      </p>
    </footer>
  );
}
