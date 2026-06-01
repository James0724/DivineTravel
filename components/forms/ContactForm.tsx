"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import Input, { Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  ContactSchema,
  type ContactFormValues,
} from "@/lib/validations/booking";
import { inputCls, labelCls } from "./SafariPlanForm";

interface ContactFormProps {
  onSuccess?: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send message");
      toast.success("Message sent! We'll reply within 24 hours.");
      reset();
      onSuccess?.();
    } catch {
      toast.error("Failed to send your message. Please try again.");
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Full Name</label>
          <input
            type="text"
            placeholder="Your name"
            className={inputCls}
            {...register("name")}
          />
        </div>
        <div>
          <label className={labelCls}>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className={inputCls}
            {...register("email")}
          />
        </div>
      </div>
      <div>
        <label className={labelCls}>Phone (optional)</label>
        <input
          type="tel"
          placeholder="+1 234 567 8900"
          className={inputCls}
          {...register("phone")}
        />
      </div>
      <div>
        <label className={labelCls}>Subject</label>
        <input
          type="text"
          placeholder="What's on your mind?"
          className={inputCls}
          {...register("subject")}
        />
      </div>
      <div>
        <label className={labelCls}>Message</label>
        <Textarea
          required
          placeholder="Tell us about your dream safari, travel dates, group size, or any questions…"
          className={`${inputCls} resize-none h-32`}
          rows={5}
          error={errors.message?.message}
          {...register("message")}
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isSubmitting}
      >
        Send Message
      </Button>
    </motion.form>
  );
}
