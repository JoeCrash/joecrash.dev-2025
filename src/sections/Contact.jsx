import {useEffect, useRef, useState} from "react";
import emailjs from "@emailjs/browser";

import TitleHeader from "../components/TitleHeader";
import ContactExperience from "../components/models/contact/ContactExperience";

const Contact = () => {
    const formRef = useRef(null);
    const isMountedRef = useRef(true);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    // Validate EmailJS configuration
    const emailjsConfig = {
        serviceId: import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        templateId: import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        publicKey: import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY,
    };

    const isEmailjsConfigured = emailjsConfig.serviceId && emailjsConfig.templateId && emailjsConfig.publicKey;

    if (!isEmailjsConfigured) {
        console.error('EmailJS environment variables are not configured');
    }

    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isEmailjsConfigured) {
            setSubmitStatus('error');
            return;
        }

        setLoading(true);
        setSubmitStatus(null);

        try {
            await emailjs.sendForm(
                emailjsConfig.serviceId,
                emailjsConfig.templateId,
                formRef.current,
                emailjsConfig.publicKey
            );
            if (isMountedRef.current) {
                // Reset form and stop loading
                setForm({ name: "", email: "", message: "" });
                setSubmitStatus('success');
            }
        } catch (error) {
            console.error("EmailJS Error:", error);
            if (isMountedRef.current) {
                setSubmitStatus('error');
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };

    return (
        <section id="contact" className="flex-center section-padding">
            <div className="w-full h-full md:px-10 px-5">
                <TitleHeader
                    title="Get in Touch – Let’s Connect"
                    sub="💬 Have questions or ideas? Let’s talk! 🚀"
                />
                <div className="grid-12-cols mt-16">
                    <div className="xl:col-span-5">
                        <div className="flex-center card-border rounded-xl p-10">
                            <form
                                ref={formRef}
                                onSubmit={handleSubmit}
                                className="w-full flex flex-col gap-7"
                            >
                                <div>
                                    <label htmlFor="name">Your name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="What’s your name?"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email">Your Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="What’s your email?"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message">Your Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="How can I help you?"
                                        rows="5"
                                        required
                                    />
                                </div>

                                <button type="submit" disabled={loading}>
                                    <div className="cta-button group">
                                        <div className="bg-circle" />
                                        <p className="text">
                                            {loading ? "Sending..." : "Send Message"}
                                        </p>
                                        <div className="arrow-wrapper">
                                            <img src="/images/arrow-down.svg" alt="arrow" />
                                        </div>
                                    </div>
                                </button>
                            </form>
                        </div>
                        {submitStatus === 'success' && (
                            <div className="text-green-500 text-center mt-4" role="alert">
                                ✓ Message sent successfully!
                            </div>
                        )}
                        {submitStatus === 'error' && (
                            <div className="text-red-500 text-center mt-4" role="alert">
                                ✗ Failed to send message. Please try again.
                            </div>
                        )}
                    </div>
                    <div className="xl:col-span-7 min-h-96">
                        <div className="bg-[#cd7c2e] w-full h-full hover:cursor-grab rounded-3xl overflow-hidden">
                            <ContactExperience />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;