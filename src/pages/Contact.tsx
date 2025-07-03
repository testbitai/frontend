import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Check,
  AlertCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import apiClient from "@/lib/apiClient";

// Mock FAQs data
const faqs = [
  {
    question: "How do I redeem coins for tests?",
    answer:
      'You can redeem your earned coins in the Rewards Store. Navigate to the "Rewards" page, browse the available tests in the store, and click "Purchase" on the desired test. The cost in coins will be automatically deducted from your balance.',
  },
  {
    question: "Can I retake a test after completing it?",
    answer:
      "Yes, you can retake any purchased test. However, your previous results will be overwritten. If you want to preserve your results, we recommend reviewing them thoroughly before retaking the test.",
  },
  {
    question: "How are the percentile ranks calculated?",
    answer:
      "Percentile ranks are calculated based on the performance of all users who have taken the same test. Your score is compared against this pool to determine what percentage of test-takers you outperformed.",
  },
  {
    question: "What happens if I lose my internet connection during a test?",
    answer:
      "Our system automatically saves your progress every 30 seconds. If you lose connection, you can resume the test from where you left off when you reconnect. For best results, we recommend using a stable internet connection.",
  },
  {
    question: "How often are new tests added?",
    answer:
      "We add new chapter-wise tests weekly and full mock tests monthly. Special event tests are announced on our home page and through notifications if you have them enabled.",
  },
];

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { type: "user" | "bot"; message: string }[]
  >([
    {
      type: "bot",
      message: "Hi there! 👋 I'm your Study Buddy! How can I help you today?",
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiClient.post("/contact", {
        name,
        email,
        subject,
        message,
      });
      toast.success("Message sent successfully!", {
        description: "We'll get back to you as soon as possible.",
      });

      setIsSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message. Please try again later.", {
        description: "If the problem persists, contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!chatMessage.trim()) return;

    // Add user message to chat
    setChatHistory((prev) => [...prev, { type: "user", message: chatMessage }]);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "";

      // Very simple keyword matching
      const lowerMsg = chatMessage.toLowerCase();
      if (lowerMsg.includes("coin") || lowerMsg.includes("redeem")) {
        botResponse =
          "You can redeem coins in the Rewards Store for tests, PDFs, and avatar accessories. Just navigate to the Rewards page and click on the item you want to purchase.";
      } else if (lowerMsg.includes("test") || lowerMsg.includes("exam")) {
        botResponse =
          "Our test series includes full mock tests, chapter-wise tests, daily quizzes, and special events. Check out our test library in the Tests section!";
      } else if (lowerMsg.includes("badge") || lowerMsg.includes("reward")) {
        botResponse =
          "Badges are earned by completing specific achievements, like scoring above 90% or maintaining a streak. View your badges in the Rewards section.";
      } else {
        botResponse =
          "Thanks for your question! For more detailed information, please check our FAQ section or send us a message through the contact form.";
      }

      setChatHistory((prev) => [
        ...prev,
        { type: "bot", message: botResponse },
      ]);
    }, 1000);

    // Clear input
    setChatMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-muted to-background">
      <Header />

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brandIndigo to-brandPurple bg-clip-text text-transparent mb-2">
              Contact Us
            </h1>
            <p className="text-muted-forground">
              We'd love to hear from you. Reach out with any questions or
              feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and our team will get back to you
                    within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        Thank you for contacting us!
                      </h3>
                      <p className="text-muted-forground mb-4">
                        We've received your message and will respond soon.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)}>
                        Send another message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Your Name
                          </label>
                          <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border bg-muted border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brandPurple focus:border-transparent"
                            placeholder="Enter your name"
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="text-sm font-medium"
                          >
                            Email Address
                          </label>
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border bg-muted border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brandPurple focus:border-transparent"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="subject"
                          className="text-sm font-medium"
                        >
                          Subject
                        </label>
                        <input
                          id="subject"
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          required
                          className="w-full px-3 py-2 border bg-muted border-gray-300  dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brandPurple focus:border-transparent"
                          placeholder="What is this about?"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="message"
                          className="text-sm font-medium"
                        >
                          Your Message
                        </label>
                        <textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                          rows={5}
                          className="w-full px-3 py-2 border bg-muted border-gray-300 resize-none dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brandPurple focus:border-transparent"
                          placeholder="How can we help you?"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-brandIndigo to-brandPurple"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3 flex-shrink-0">
                      <Mail className="h-5 w-5 text-brandIndigo" />
                    </div>
                    <div>
                      <h3 className="font-medium text-forground">Email</h3>
                      <a
                        href="mailto:support@jeeprepapp.com"
                        className="text-brandPurple hover:underline"
                      >
                        support@testbit.in
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3 flex-shrink-0">
                      <Phone className="h-5 w-5 text-brandIndigo" />
                    </div>
                    <div>
                      <h3 className="font-medium text-forground">Phone</h3>
                      <a
                        href="tel:+919876543210"
                        className="text-muted-forground"
                      >
                        +91 123 456 7890
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3 flex-shrink-0">
                      <MapPin className="h-5 w-5 text-brandIndigo" />
                    </div>
                    <div>
                      <h3 className="font-medium text-forground">Office</h3>
                      <p className="text-muted-forground">
                        Bhubaneswar, Odisha
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="font-medium text-forground mb-3">
                      Follow Us
                    </h3>
                    <div className="flex space-x-3">
                      <a
                        href="#"
                        className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-100/20 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                      <a
                        href="#"
                        className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-100/20 flex items-center justify-center text-blue-500 hover:bg-blue-200 transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                      <a
                        href="#"
                        className="h-10 w-10 rounded-full bg-pink-100 dark:bg-pink-100/20 flex items-center justify-center text-pink-600 hover:bg-pink-200 transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a
                        href="#"
                        className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-100/20 flex items-center justify-center text-blue-700 hover:bg-blue-200 transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hours Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Operating Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                    <p className="text-sm text-yellow-700">
                      Support response times may be longer during weekends and
                      holidays.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              Frequently Asked Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="overflow-hidden">
                  <div
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      expandedFaq === index ? "bg-purple-50" : ""
                    }`}
                    onClick={() => toggleFaq(index)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{faq.question}</h3>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        {expandedFaq === index ? "-" : "+"}
                      </Button>
                    </div>

                    {expandedFaq === index && (
                      <div className="mt-3 text-muted-forground animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Chat Widget Button */}
          <div className="fixed bottom-6 right-6">
            <Button
              onClick={() => setChatOpen(!chatOpen)}
              className={`h-14 w-14 rounded-full flex items-center justify-center ${
                chatOpen
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gradient-to-r from-brandIndigo to-brandPurple"
              }`}
            >
              {chatOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <MessageSquare className="h-6 w-6" />
              )}
            </Button>

            {/* Chat Widget */}
            {chatOpen && (
              <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-background rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="bg-gradient-to-r from-brandIndigo to-brandPurple text-white p-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-background/20 flex items-center justify-center mr-3">
                      <img
                        src="/placeholder.svg"
                        alt="Study Buddy"
                        className="h-8 w-8 rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">Study Buddy</h3>
                      <p className="text-xs opacity-90">
                        Online | Quick answers to your questions
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-80 p-4 overflow-y-auto bg-muted flex flex-col space-y-3">
                  {chatHistory.map((chat, index) => (
                    <div
                      key={index}
                      className={`max-w-3/4 p-3 rounded-lg ${
                        chat.type === "user"
                          ? "bg-brandPurple text-white ml-auto"
                          : "bg-background border border-gray-200 dark:border-gray-800"
                      }`}
                    >
                      {chat.message}
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleChatSubmit}
                  className="p-3 border-t border-gray-200 dark:border-gray-800 flex"
                >
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 px-3 py-2 bg-muted border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-1 focus:ring-brandPurple focus:border-brandPurple"
                  />
                  <Button
                    type="submit"
                    className="rounded-l-none bg-gradient-to-r from-brandIndigo to-brandPurple"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
