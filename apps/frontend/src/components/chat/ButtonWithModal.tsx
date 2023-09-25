function ButtonWithModal ({ text }) {
  // Custom button component logic and JSX
  return (
    <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer">
      { text }
    </button>
  );
}

export default ButtonWithModal;
