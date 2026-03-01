import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/contact", data);
      toast({
        title: "Message sent",
        description: "Thank you for your message. I'll get back to you soon!",
        variant: "default",
      });
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-32 bg-slate-950 relative overflow-hidden"
    >
      {/* Gradient accent */}
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Section header - centered */}
        <div
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-blue-400 font-mono text-sm mb-4 tracking-wider">
            04. What's Next?
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
            Get In Touch
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            I'm currently open to new opportunities and interesting projects.
            Whether you have a question or just want to say hi, my inbox is
            always open.
          </p>
        </div>

        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid md:grid-cols-5 gap-12">
            {/* Contact info */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="text-slate-100 font-semibold mb-4">
                  Contact Details
                </h3>
                <div className="space-y-4">
                  <a
                    href="mailto:ngattusohw@gmail.com"
                    className="flex items-center gap-3 text-slate-400 hover:text-blue-400 transition-colors group"
                  >
                    <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span>ngattusohw@gmail.com</span>
                  </a>
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <span>Red Bank, NJ</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-slate-100 font-semibold mb-4">Socials</h3>
                <div className="flex gap-3">
                  <a
                    href="https://github.com/ngattusohw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-slate-800 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/in/nicholas-gattuso"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-slate-800 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="https://x.com/NickGattuso"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-slate-800 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm text-slate-400 mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className={`w-full px-4 py-3 bg-slate-900 border ${
                        errors.name ? "border-red-500" : "border-slate-800"
                      } rounded-lg focus:outline-none focus:border-blue-500 text-slate-100 placeholder-slate-500 transition-colors`}
                      placeholder="Your name"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="mt-1 text-red-400 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm text-slate-400 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className={`w-full px-4 py-3 bg-slate-900 border ${
                        errors.email ? "border-red-500" : "border-slate-800"
                      } rounded-lg focus:outline-none focus:border-blue-500 text-slate-100 placeholder-slate-500 transition-colors`}
                      placeholder="your.email@example.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-red-400 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm text-slate-400 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:border-blue-500 text-slate-100 placeholder-slate-500 transition-colors"
                    placeholder="What's this about?"
                    {...register("subject")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm text-slate-400 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className={`w-full px-4 py-3 bg-slate-900 border ${
                      errors.message ? "border-red-500" : "border-slate-800"
                    } rounded-lg focus:outline-none focus:border-blue-500 text-slate-100 placeholder-slate-500 transition-colors resize-none`}
                    placeholder="Your message..."
                    {...register("message")}
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-red-400 text-sm">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-lg transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
