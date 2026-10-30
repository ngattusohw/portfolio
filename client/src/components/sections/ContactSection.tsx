import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().optional(),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
      await apiRequest("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
      });
      toast({
        title: "Message sent",
        description: "Thank you for your message. I'll get back to you soon!",
        variant: "default",
      });
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="folio-section contact-section"
      aria-labelledby="contact-title"
    >
      <div className="folio-container contact-grid">
        <div className="contact-copy">
          <p className="folio-kicker">V / Start a conversation</p>
          <h2 id="contact-title">
            What are you
            <br />
            <em>building?</em>
          </h2>
          <p>
            Have an idea to explore, a system to untangle, or a team to grow?
            I'd like to hear about it.
          </p>
          <a className="contact-email" href="mailto:ngattusohw@gmail.com">
            ngattusohw@gmail.com <span aria-hidden="true">↗</span>
          </a>
          <span className="contact-note">Based in Red Bank, NJ.</span>
        </div>
        <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="contact-form-pair">
            <div>
              <label htmlFor="name">
                Your name <span aria-hidden="true">*</span>
              </label>
              <input
                id="name"
                autoComplete="name"
                placeholder="Alex Smith"
                aria-required="true"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                {...register("name")}
              />
              {errors.name && (
                <p className="form-error" id="name-error">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email">
                Email address <span aria-hidden="true">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="alex@company.com"
                aria-required="true"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
              {errors.email && (
                <p className="form-error" id="email-error">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="subject">
              What’s on your mind? <span>(optional)</span>
            </label>
            <input
              id="subject"
              placeholder="A new project, a technical challenge…"
              {...register("subject")}
            />
          </div>
          <div>
            <label htmlFor="message">
              A little about it <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="Tell me what you’re working on."
              aria-required="true"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
              {...register("message")}
            />
            {errors.message && (
              <p className="form-error" id="message-error">
                {errors.message.message}
              </p>
            )}
          </div>
          <div className="contact-form-bottom">
            <span>Required fields marked *</span>
            <button
              type="submit"
              className="folio-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending…" : "Send message"}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
