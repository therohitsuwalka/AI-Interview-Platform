function AuthBanner() {
  return (
    <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-16">

      <h1 className="text-5xl font-black leading-tight">
        Crack Your
        <br />
        Dream Job
      </h1>

      <p className="mt-8 text-lg leading-8 opacity-90">

        Practice AI interviews,
        improve your resume,
        solve coding rounds
        and get instant feedback.

      </p>

      <div className="mt-16 space-y-6">

        <div>✅ AI HR Interview</div>

        <div>✅ Coding Round</div>

        <div>✅ Resume ATS Score</div>

        <div>✅ Voice Analysis</div>

      </div>

    </div>
  );
}

export default AuthBanner;