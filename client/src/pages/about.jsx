const About = () => {
  return (
    <div
      className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-6"
      style={{
        backgroundImage: `url("/campus.jpg")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        fontFamily: "'Poppins', sans-serif", // Applying the custom font
      }}
    >
      <div className="max-w-5xl w-full bg-[#4d6b2c] bg-opacity-80 text-white rounded-xl shadow-2xl p-6 sm:p-8 md:p-12 space-y-8">
        {/* Header */}
        <h1 className="text-4xl sm:text-3xl md:text-4xl font-extrabold text-center text-white tracking-wide mb-6">
          About <span className="text-yellow-300">Campus Connect</span>
        </h1>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 border-b-2 border-yellow-300 inline-block text-yellow-100">
            Our Mission
          </h2>
          <p className="text-lg leading-relaxed text-gray-200">
            Campus Connect transforms campus life by creating a unified platform that connects students, simplifies coordination, and makes collaborative experiences effortless. We believe in building a more connected, supportive, and efficient campus community.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 border-b-2 border-yellow-300 inline-block text-yellow-100">
            What We Do
          </h2>
          <p className="text-lg leading-relaxed mb-4 text-gray-200">
            We provide a single platform where students can:
          </p>
          <ul className="list-disc pl-8 space-y-2 text-base text-gray-200">
            <li className="font-semibold">Organize sports activities</li>
            <li className="font-semibold">Coordinate group travels</li>
            <li className="font-semibold">Create gaming sessions</li>
            <li className="font-semibold">Connect with fellow students instantly</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 border-b-2 border-yellow-300 inline-block text-yellow-100">
            Our Vision
          </h2>
          <p className="text-lg leading-relaxed text-gray-200">
            To break down barriers between students, reduce individual expenses, and create more opportunities for interaction, learning, and fun. We&apos;re not just an app; we&apos;re a community builder.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 border-b-2 border-yellow-300 inline-block text-yellow-100">
            Why We Started
          </h2>
          <p className="text-lg leading-relaxed text-gray-200">
            Born from the common campus challenge of &ldquo;Who wants to join?&ldquo;, our team recognized the need for a simple, intuitive solution that brings students together. We&apos;ve experienced the hassle of coordinating activities and decided to solve it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 border-b-2 border-yellow-300 inline-block text-yellow-100">
            Our Values
          </h2>
          <ul className="list-disc pl-8 space-y-2 text-base text-gray-200">
            <li className="font-semibold">Simplicity</li>
            <li className="font-semibold">Community</li>
            <li className="font-semibold">Cost-effectiveness</li>
            <li className="font-semibold">Inclusivity</li>
            <li className="font-semibold">Real-time Collaboration</li>
          </ul>
        </section>

        <div className="text-center mt-8">
          <p className="text-lg leading-relaxed text-gray-200">
            <span className="font-bold text-yellow-300">Founded by students, built for students</span> – Campus Connect is more than a website. It&lsquo;s your campus, <span className="italic">connected</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
