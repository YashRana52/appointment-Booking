import { Stethoscope } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const MailIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6654 4.66699L8.67136 8.48499C8.46796 8.60313 8.23692 8.66536 8.0017 8.66536C7.76647 8.66536 7.53544 8.60313 7.33203 8.48499L1.33203 4.66699M2.66536 2.66699H13.332C14.0684 2.66699 14.6654 3.26395 14.6654 4.00033V12.0003C14.6654 12.7367 14.0684 13.3337 13.332 13.3337H2.66536C1.92898 13.3337 1.33203 12.7367 1.33203 12.0003V4.00033C1.33203 3.26395 1.92898 2.66699 2.66536 2.66699Z"
        stroke="#90A1B9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const PhoneIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.22 11.045C9.358 11.108 9.513 11.123 9.66 11.086C9.807 11.049 9.937 10.964 10.029 10.843L10.265 10.533C10.39 10.367 10.551 10.233 10.736 10.14C10.921 10.048 11.125 9.999 11.332 9.999H13.332C13.686 9.999 14.025 10.14 14.275 10.39C14.525 10.64 14.665 10.979 14.665 11.333V13.333C14.665 13.687 14.525 14.026 14.275 14.276C14.025 14.526 13.686 14.666 13.332 14.666C10.149 14.666 7.097 13.402 4.847 11.152C2.597 8.901 1.332 5.849 1.332 2.667C1.332 2.313 1.473 1.974 1.723 1.724C1.973 1.474 2.312 1.333 2.665 1.333H4.665C5.019 1.333 5.358 1.474 5.608 1.724C5.858 1.974 5.999 2.313 5.999 2.667V4.667C5.999 4.874 5.951 5.077 5.858 5.263C5.765 5.448 5.631 5.609 5.465 5.733L5.153 5.967C5.031 6.06 4.945 6.193 4.909 6.343C4.874 6.493 4.891 6.651 4.959 6.789C5.87 8.64 7.368 10.136 9.22 11.045Z"
        stroke="#90A1B9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const MapPinIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.335 6.666C13.335 9.995 9.642 13.462 8.402 14.532C8.286 14.619 8.146 14.666 8.001 14.666C7.857 14.666 7.716 14.619 7.601 14.532C6.361 13.462 2.668 9.995 2.668 6.666C2.668 5.252 3.23 3.895 4.23 2.895C5.23 1.895 6.587 1.333 8.001 1.333C9.416 1.333 10.772 1.895 11.772 2.895C12.773 3.895 13.335 5.252 13.335 6.666Z"
        stroke="#90A1B9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.001 8.666C9.106 8.666 10.001 7.771 10.001 6.666C10.001 5.562 9.106 4.666 8.001 4.666C6.897 4.666 6.001 5.562 6.001 6.666C6.001 7.771 6.897 8.666 8.001 8.666Z"
        stroke="#90A1B9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Add your SVGs for social icons
  const FacebookIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.999 1.667H12.499C11.394 1.667 10.334 2.106 9.552 2.887C8.771 3.669 8.332 4.729 8.332 5.834V8.334H5.832V11.667H8.332V18.334H11.666V11.667H14.166L14.999 8.334H11.666V5.834C11.666 5.613 11.753 5.401 11.909 5.244C12.066 5.088 12.278 5 12.499 5H14.999V1.667Z"
        stroke="#90A1B9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const InstagramIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.585 5.417H14.593M5.835 1.667H14.168C16.469 1.667 18.335 3.532 18.335 5.834V14.167C18.335 16.468 16.469 18.334 14.168 18.334H5.835C3.533 18.334 1.668 16.468 1.668 14.167V5.834C1.668 3.532 3.533 1.667 5.835 1.667ZM13.335 9.475C13.438 10.169 13.319 10.877 12.996 11.5C12.673 12.122 12.162 12.627 11.536 12.942C10.91 13.257 10.2 13.367 9.508 13.255C8.816 13.144 8.176 12.817 7.68 12.321C7.185 11.826 6.858 11.186 6.746 10.494C6.635 9.802 6.745 9.092 7.06 8.466C7.375 7.839 7.88 7.328 8.502 7.006C9.124 6.683 9.833 6.564 10.526 6.667C11.234 6.772 11.889 7.102 12.394 7.607C12.9 8.113 13.23 8.768 13.335 9.475Z"
        stroke="#90A1B9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const TwitterIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.335 3.334C18.335 3.334 17.751 5.084 16.668 6.167C18.001 14.5 8.835 20.584 1.668 15.834C3.502 15.917 5.335 15.334 6.668 14.167C2.501 12.917 0.418 8.000 2.501 4.167C4.335 6.334 7.168 7.584 10.001 7.5C9.251 4.0 13.335 2.0 15.835 4.334C16.751 4.334 18.335 3.334 18.335 3.334Z"
        stroke="#90A1B9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const LinkedinIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.335 6.667C14.661 6.667 15.933 7.194 16.87 8.132C17.808 9.069 18.335 10.341 18.335 11.667V17.5H15.001V11.667C15.001 11.225 14.826 10.801 14.513 10.489C14.201 10.176 13.777 10 13.335 10C12.893 10 12.469 10.176 12.156 10.489C11.844 10.801 11.668 11.225 11.668 11.667V17.5H8.335V11.667C8.335 10.341 8.861 9.069 9.799 8.132C10.737 7.194 12.009 6.667 13.335 6.667Z"
        stroke="#90A1B9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.001 7.5H1.668V17.5H5.001V7.5Z"
        stroke="#90A1B9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.335 5C4.255 5 5.001 4.254 5.001 3.334C5.001 2.414 4.255 1.667 3.335 1.667C2.414 1.667 1.668 2.414 1.668 3.334C1.668 4.254 2.414 5 3.335 5Z"
        stroke="#90A1B9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const socialIcons = [
    { icon: FacebookIcon, link: "https://www.facebook.com" },
    { icon: InstagramIcon, link: "https://www.instagram.com" },
    { icon: TwitterIcon, link: "https://twitter.com" },
    { icon: LinkedinIcon, link: "https://www.linkedin.com" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 text-slate-600">
      <div className="max-w-7xl mx-auto py-10 px-6 flex flex-col md:flex-row justify-between gap-10">
        {/* Logo & About */}
        <div className="flex flex-col gap-4 max-w-sm">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-700">Medicare+</span>
          </Link>
          <p className="text-sm">
            Your trusted platform for online doctor consultations, health
            checkups, prescriptions, and wellness tips — all in one place.
          </p>

          <div className="flex gap-3 mt-2">
            {socialIcons.map((item, i) => (
              <Link
                href={item.link}
                key={i}
                className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full hover:scale-105 transition"
              >
                <item.icon />
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <MailIcon />
            <span>yashrana097@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneIcon />
            <span>+91 9569633102</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon />
            <span>Lucknow, India</span>
          </div>
        </div>
      </div>

      <p className="text-center text-sm py-4 border-t border-gray-200">
        © 2025 Medicare+. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
