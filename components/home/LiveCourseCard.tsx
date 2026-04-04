"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Radio, User, ArrowLeft } from "lucide-react";

interface LiveCourse {
  id: string;
  slug?: string;
  title: string;
  instructor_name?: string;
  instructor_photo?: string;
  image_url?: string;
  price?: number;
  currency?: string;
  delivery_mode: "live" | "in_person";
  users?: { full_name: string; avatar_url?: string };
}

interface LiveCourseCardProps {
  course: LiveCourse;
  index?: number;
}

export default function LiveCourseCard({ course, index = 0 }: LiveCourseCardProps) {
  const isLive = course.delivery_mode === "live";
  const badgeColor = isLive ? "#EF4444" : "#8B5CF6";
  const badgeLabel = isLive ? "بث مباشر" : "حضوري";
  const BadgeIcon = isLive ? Radio : MapPin;
  const href = `/courses/${course.slug || course.id}`;
  const instructorName = course.users?.full_name || course.instructor_name || "";
  const instructorPhoto = course.users?.avatar_url || course.instructor_photo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="flex-shrink-0 w-60 rounded-2xl overflow-hidden group cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1.5px solid ${badgeColor}40`,
        boxShadow: `0 8px 24px ${badgeColor}22`,
      }}
    >
      {/* Thumbnail */}
      <div className="relative h-36 overflow-hidden">
        {course.image_url ? (
          <img
            src={course.image_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `${badgeColor}20` }}
          >
            <BadgeIcon size={40} style={{ color: badgeColor }} />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Pulsing badge */}
        <div className="absolute top-2.5 right-2.5">
          <span
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-[11px] font-bold animate-pulse"
            style={{ background: badgeColor }}
          >
            <BadgeIcon size={10} />
            {badgeLabel}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2">
        <h3
          className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:transition-colors"
          style={{ ["--tw-text-opacity" as string]: 1 }}
        >
          {course.title}
        </h3>

        {instructorName && (
          <div className="flex items-center gap-1.5">
            {instructorPhoto ? (
              <img
                src={instructorPhoto}
                alt={instructorName}
                className="w-5 h-5 rounded-full object-cover border border-white/10"
              />
            ) : (
              <User size={12} className="text-slate-500" />
            )}
            <span className="text-xs text-slate-500 truncate">{instructorName}</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-1">
          <span className="font-black text-sm" style={{ color: badgeColor }}>
            {course.price ? `${course.price} ${course.currency || "ل.س"}` : "مجاني"}
          </span>
          <Link
            href={href}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all hover:opacity-90"
            style={{
              background: `${badgeColor}22`,
              border: `1px solid ${badgeColor}66`,
              color: badgeColor,
            }}
          >
            سجّل الآن
            <ArrowLeft size={11} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
