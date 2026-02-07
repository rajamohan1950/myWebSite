import Link from "next/link";

export default function Profile() {
  return (
    <main className="mx-auto max-w-[var(--container)] px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="space-y-16">
        {/* Hero */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 text-center sm:p-12">
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-tight text-[var(--apple-text)]">
            Rajamohan Jabbala
          </h1>
          <p className="mt-2 text-lg font-normal text-[var(--apple-link)]">
            AI/ML Innovation Leader
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-[var(--apple-text-secondary)] leading-relaxed">
            Transformational AI/ML leader with 20+ years of experience delivering
            enterprise-grade conversational intelligence platforms, IVA
            solutions, and AI-driven automation at scale.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/book-a-call" className="btn-primary">
              Contact Me
            </Link>
            <Link href="/linkedin" className="btn-secondary">
              LinkedIn Profile
            </Link>
          </div>
        </section>

        {/* Professional Summary - 3 pillars */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 sm:p-10" aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="text-xl font-semibold text-[var(--apple-text)] mb-6">
            Professional Summary
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                num: "1",
                title: "AI/ML Leadership",
                text: "20+ years delivering enterprise-grade conversational intelligence platforms and AI-driven automation at scale.",
              },
              {
                num: "2",
                title: "Proven Results",
                text: "Reduced reconciliation time by 92%, scaled AI platforms to 10M+ users, and cut capacity planning from 1 week to 1 minute.",
              },
              {
                num: "3",
                title: "Technical Expertise",
                text: "Deep knowledge of NLP, generative AI, RAG systems, MLOps, Python, TensorFlow, PyTorch, and cloud platforms.",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg-secondary)] p-5"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-light)] text-sm font-semibold text-[var(--apple-link)]">
                  {item.num}
                </span>
                <h3 className="mt-3 font-semibold text-[var(--apple-text)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--apple-text-secondary)]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Work Experience */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 sm:p-10" aria-labelledby="work-heading">
          <h2 id="work-heading" className="text-xl font-semibold text-[var(--apple-text)] mb-6">
            Work Experience
          </h2>
          <ul className="space-y-6">
            {[
              {
                title: "Chief Technology Officer — Bonito Designs",
                text: "Developed Project Raven reducing design retrieval time from 1 day to 500ms. Created AI-powered Sales Agent 'Suchi' automating 400+ daily sales calls. Established robust MLOps infrastructure improving scalability by 40%.",
              },
              {
                title: "Chief Technology Officer — Convergent Inc",
                text: "Led $200M enterprise cloud transformation, improving scalability by 40%. Designed real-time ML pipelines enabling real-time analytics while maintaining high availability.",
              },
              {
                title: "Software Development Manager — Amazon Inc",
                text: "Launched Alexa Prime Video platform improving conversion to 3.5%. Developed 'Clairvoyant' reducing capacity planning from 1 week to 1 minute.",
              },
            ].map((job) => (
              <li key={job.title} className="rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg-secondary)] p-5">
                <h3 className="font-semibold text-[var(--apple-text)]">{job.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--apple-text-secondary)]">{job.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Education */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 sm:p-10" aria-labelledby="edu-heading">
          <h2 id="edu-heading" className="text-xl font-semibold text-[var(--apple-text)] mb-6">
            Education
          </h2>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="font-semibold text-[var(--apple-text)] shrink-0">M.Tech</span>
              <span className="text-[var(--apple-text-secondary)]">Computer Engineering — Indian Institute of Technology, Chennai, India (1997–2000)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-[var(--apple-text)] shrink-0">M.S</span>
              <span className="text-[var(--apple-text-secondary)]">Applied Statistics — Osmania University, Hyderabad, India (1995–1997)</span>
            </li>
          </ul>
        </section>

        {/* Technical Skills */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 sm:p-10" aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="text-xl font-semibold text-[var(--apple-text)] mb-6">
            Technical Skills
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "AI/ML & Generative AI", value: "NLP, RAG, GPT Models, LSTMs, XGBoost, Transformer Models, TensorFlow, PyTorch, Hugging Face" },
              { label: "Cloud & DevOps", value: "AWS, GCP, Azure, Kubernetes, Docker, CI/CD, Microservices, Serverless Architectures" },
              { label: "Conversational AI", value: "IVA, Chatbots, ASR, TTS, Conversational Intelligence, Agent Assist" },
            ].map((s) => (
              <div key={s.label} className="rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg-secondary)] p-4">
                <h3 className="font-semibold text-[var(--apple-text)] text-sm">{s.label}</h3>
                <p className="mt-1 text-sm text-[var(--apple-text-secondary)]">{s.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Publications & Patents */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 sm:p-10" aria-labelledby="pub-heading">
          <h2 id="pub-heading" className="text-xl font-semibold text-[var(--apple-text)] mb-6">
            Publications & Patents
          </h2>
          <ul className="space-y-3 text-[var(--apple-text-secondary)]">
            <li><strong className="text-[var(--apple-text)]">Raster Snap function for Vectorization</strong> — Published by IEEE, January 2000</li>
            <li><strong className="text-[var(--apple-text)]">Elastic Neighbourhood Patent</strong> — Method to determine the Elastic Neighbourhood for positioning of display unit, granted by Govt of India, 2014</li>
            <li><strong className="text-[var(--apple-text)]">Cutlist Optimization Patent</strong> — Ensemble Algorithm patent granted by Govt of India, July 2024</li>
          </ul>
        </section>

        {/* Volunteering */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 sm:p-10" aria-labelledby="vol-heading">
          <h2 id="vol-heading" className="text-xl font-semibold text-[var(--apple-text)] mb-6">
            Volunteering Activities
          </h2>
          <ul className="space-y-2 text-[var(--apple-text-secondary)]">
            <li><strong className="text-[var(--apple-text)]">Environmental Cleanup</strong> — Collaborated with volunteers to restore natural beauty by removing plastic waste from hiking paths.</li>
            <li><strong className="text-[var(--apple-text)]">Blood Donation Drives</strong> — Led initiatives with Indian Red Cross Society, gathering more than 350 units of blood.</li>
            <li><strong className="text-[var(--apple-text)]">Rural Upskilling</strong> — Assisted in Nasscom's rural upskilling program in India, empowering local communities.</li>
          </ul>
        </section>

        {/* Awards */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 sm:p-10" aria-labelledby="awards-heading">
          <h2 id="awards-heading" className="text-xl font-semibold text-[var(--apple-text)] mb-6">
            Awards & Recognition
          </h2>
          <div className="flex flex-wrap gap-6">
            <div className="rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg-secondary)] px-6 py-4 text-center">
              <span className="text-2xl font-semibold text-[var(--apple-link)]">100</span>
              <p className="mt-1 text-sm text-[var(--apple-text-secondary)]">Top Healthcare Startups — F6S recognized Aurospaces.com among the top 100 healthcare startups globally.</p>
            </div>
            <div className="rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg-secondary)] px-6 py-4 text-center">
              <span className="text-2xl font-semibold text-[var(--apple-link)]">1</span>
              <p className="mt-1 text-sm text-[var(--apple-text-secondary)]">Speaker Recognition — Featured speaker at the prestigious ET Now Digital Native Awards.</p>
            </div>
          </div>
        </section>

        {/* Personal Achievements */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 sm:p-10" aria-labelledby="personal-heading">
          <h2 id="personal-heading" className="text-xl font-semibold text-[var(--apple-text)] mb-6">
            Personal Achievements
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "Paris–Brest–Paris Cyclothon", desc: "Completed 300 km under 15 hours" },
              { title: "Himalayan Trek", desc: "Trekked Chandrakani pass covering 100 km in 10 days" },
              { title: "Off-Road Cycling", desc: "Finished challenging course from 1478 m altitude" },
            ].map((a) => (
              <div key={a.title} className="rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg-secondary)] p-5">
                <h3 className="font-semibold text-[var(--apple-text)]">{a.title}</h3>
                <p className="mt-1 text-sm text-[var(--apple-text-secondary)]">{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why I'm The Right Fit */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 sm:p-10" aria-labelledby="fit-heading">
          <h2 id="fit-heading" className="text-xl font-semibold text-[var(--apple-text)] mb-6">
            Why I'm The Right Fit
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { num: "1", title: "Strategic Vision", text: "Combining technical depth with business acumen" },
              { num: "2", title: "Proven Results", text: "95% compliance accuracy, 40% scalability improvement" },
              { num: "3", title: "Technical Leadership", text: "20+ years leading AI/ML initiatives in NLP and MLOps" },
            ].map((item) => (
              <div key={item.num} className="rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg-secondary)] p-5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-light)] text-sm font-semibold text-[var(--apple-link)]">
                  {item.num}
                </span>
                <h3 className="mt-3 font-semibold text-[var(--apple-text)]">{item.title}</h3>
                <p className="mt-1 text-sm text-[var(--apple-text-secondary)]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
