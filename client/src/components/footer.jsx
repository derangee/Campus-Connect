const Footer = () => {
  return (
    <footer className="bg-[#4d6b2c] text-white py-4 px-6 mt-auto">
      <div className="flex flex-col items-center space-y-2 md:space-y-0 md:flex-row md:justify-center md:gap-4">
        <p className="text-sm text-center">
          Feel free to reach out if you are having any trouble or need assistance by filling out this feedback form!
        </p>
        <button
          onClick={() => (window.location.href = "/feedback")}
          className="bg-white text-[#4d6b2c] font-bold py-2 px-4 rounded shadow hover:bg-gray-100 transition-transform transform hover:scale-105"
        >
          Feedback
        </button>
      </div>
    </footer>
  );
};

export default Footer;
