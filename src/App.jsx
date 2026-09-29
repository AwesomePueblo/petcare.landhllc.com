function openBooking() {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({
      url: "https://calendly.com/rachelelisehiggins/grooming",
    });
  }
  return false;
}

function SectionIcon({ children }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export default function App() {
  return (
    <main>
      <header className="hero">
        <h1>Dog Grooming by Rachel Higgins</h1>
        <p className="subtitle">
          Reliable, patient dog grooming with a focus on care, comfort, and
          quality.
        </p>
      </header>

      <section className="card">
        <h2>
          <SectionIcon>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </SectionIcon>
          Book an Appointment
        </h2>
        <p>
          Appointments are scheduled online and availability is always up to
          date. Select a time that works best for you.
        </p>

        <button
          className="book-btn"
          onClick={(e) => {
            e.preventDefault();
            openBooking();
          }}
        >
          Book a Grooming Appointment
        </button>
      </section>

      <section className="card">
        <h2>
          <SectionIcon>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </SectionIcon>
          About
        </h2>
        <p>
          I’m Rachel Higgins, a self-employed dog groomer with hands-on
          experience grooming dogs since 2023. I work independently and take
          pride in providing calm, attentive care tailored to each dog.
        </p>
        <p>
          I’ve built a loyal base of repeat clients through consistent
          quality, clear communication, and a practical, patient
          approach—especially with nervous or high-energy dogs.
        </p>
      </section>

      <section className="card">
        <h2>
          <SectionIcon>
            <path d="M12 2 2 7l10 5 10-5-10-5Z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </SectionIcon>
          Experience & Care
        </h2>
        <p>
          My background includes full-service grooming such as bathing, blow
          drying, brushing, trimming, and general care. I’m comfortable
          handling dogs of different sizes and temperaments.
        </p>
        <p>
          I also have years of experience working with children and
          families, which reflects the level of responsibility, trust, and
          attention I bring to every appointment.
        </p>
      </section>

      <footer>
        <p>© Rachel Higgins</p>
        <p className="credit">
          Built by{" "}
          <a href="https://landhllc.com" target="_blank" rel="noopener">
            landhllc.com
          </a>
        </p>
      </footer>
    </main>
  );
}
