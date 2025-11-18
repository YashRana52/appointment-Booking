import React from "react";

const cardsData = [
  {
    image:
      "https://media.istockphoto.com/id/1279844456/photo/young-indian-business-woman-entrepreneur-looking-at-camera-in-the-office.jpg?s=2048x2048&w=is&k=20&c=HFSZlaDFEoUKkGgTVduvYumtJoX2vev6FkGd-jscLUo=",
    name: "Priya Sharma",
    handle: "@priya_says",
    date: "March 10, 2025",
    review:
      "Dr. Mehta was extremely kind and listened patiently to all my concerns. The video consultation felt just like an in-person visit!",
  },
  {
    image:
      "https://images.unsplash.com/photo-1607081692251-d689f1b9af84?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGluZGlhbiUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D",
    name: "Rohit Verma",
    handle: "@rohit_v",
    date: "April 22, 2025",
    review:
      "Very professional and helpful. Got my prescription instantly after consultation. Highly recommend this service!",
  },
  {
    image:
      "https://images.unsplash.com/photo-1660067262025-271603ac1283?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwd29tZW58ZW58MHx8MHx8fDA%3D",
    name: "Neha Patel",
    handle: "@nehacares",
    date: "May 3, 2025",
    review:
      "The app experience is super smooth! Dr. Nair explained everything clearly and helped me feel at ease.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1534339480783-6816b68be29c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aW5kaWFuJTIwbWFufGVufDB8fDB8fHww",
    name: "Aman Singh",
    handle: "@aman_speaks",
    date: "June 5, 2025",
    review:
      "Loved how easy it was to book a slot! My doctor was friendly, on time, and gave great advice for my routine checkup.",
  },
];

function Testimonial() {
  const CreateCard = ({ card }) => (
    <div className="p-4 rounded-2xl mx-4 shadow-md hover:shadow-xl bg-white transition-all duration-300 w-72 shrink-0 border border-gray-100">
      {/* Profile */}
      <div className="flex gap-3 items-center">
        <img
          className="w-11 h-11 rounded-full object-cover"
          src={card.image}
          alt={card.name}
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-1 font-semibold text-blue-900">
            <p>{card.name}</p>
          </div>
          <span className="text-xs text-slate-500">{card.handle}</span>
        </div>
      </div>

      {/* Review */}
      <p className="text-sm py-4 text-gray-700 leading-relaxed italic">
        “{card.review}”
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-slate-500 text-xs border-t pt-3">
        <p>{card.date}</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="text-3xl md:text-4xl font-bold text-center text-blue-900 mt-10">
        Our Patients Love Us ❤️
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee {
          display: flex;
          min-width: 200%;
          animation: marquee 28s linear infinite;
        }
        .marquee-reverse {
          display: flex;
          min-width: 200%;
          animation: marquee 28s linear infinite reverse;
        }
      `}</style>

      {/* First Row */}
      <div className="overflow-hidden w-full max-w-6xl mx-auto relative mt-10">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
        <div className="marquee">
          {[...cardsData, ...cardsData].map((card, index) => (
            <CreateCard key={index} card={card} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
      </div>

      {/* Second Row*/}
      <div className="overflow-hidden w-full max-w-6xl mx-auto relative mt-10">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
        <div className="marquee-reverse">
          {[...cardsData, ...cardsData].map((card, index) => (
            <CreateCard key={index} card={card} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
      </div>
    </>
  );
}

export default Testimonial;
