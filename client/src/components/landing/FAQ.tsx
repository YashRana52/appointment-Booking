import React, { useState } from "react";

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqsData = [
    {
      question: "How do I book an appointment with a doctor?",
      answer:
        "Simply choose your preferred doctor, select a date and time slot, and confirm your appointment — all within the app. You’ll get instant confirmation!",
    },
    {
      question: "Can I talk to doctors online?",
      answer:
        "Yes! You can schedule both video and chat consultations. Our doctors are available 24/7 for online appointments.",
    },
    {
      question: "Are my medical details kept private?",
      answer:
        "Absolutely. All your health records and conversations are encrypted and securely stored. Only you and your doctor can access them.",
    },
    {
      question: "Can I reschedule or cancel an appointment?",
      answer:
        "Of course! You can easily reschedule or cancel from the 'My Appointments' section. We recommend doing it at least 2 hours before your scheduled time.",
    },
    {
      question: "Do I need to pay online?",
      answer:
        "You can pay using any method — UPI, debit/credit card, or wallet. Payments are fully secure and you’ll receive an instant receipt.",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <div className="flex flex-col items-center text-center text-slate-800 px-3 mt-16">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900 m-8">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-500 mt-4 max-w-sm">
          Here are some common questions our patients often ask before booking
          their appointments.
        </p>

        <div className="max-w-4xl w-full mt-6 flex flex-col gap-4 items-start text-left mb-10">
          {faqsData.map((faq, index) => (
            <div key={index} className="flex flex-col items-start w-full">
              <div
                className="flex items-center justify-between w-full cursor-pointer bg-gradient-to-r from-blue-50 to-white border border-blue-100 p-4 rounded"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h2 className="text-sm font-medium text-slate-800">
                  {faq.question}
                </h2>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${
                    openIndex === index ? "rotate-180" : ""
                  } transition-all duration-500 ease-in-out`}
                >
                  <path
                    d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                    stroke="#1D293D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p
                className={`text-sm text-slate-600 px-4 transition-all duration-500 ease-in-out ${
                  openIndex === index
                    ? "opacity-100 max-h-[300px] translate-y-0 pt-4"
                    : "opacity-0 max-h-0 -translate-y-2"
                }`}
              >
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FAQ;
