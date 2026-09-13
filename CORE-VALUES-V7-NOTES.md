# v7 Core Values Image Fix

- Updated `src/components/home/CoreValuesSection.tsx`.
- Restored the rounded outer frame (`rounded-3xl`) and kept `overflow-hidden`.
- Increased image scale from `scale-110` to `scale-[1.25]` so the white/rounded padding baked into the uploaded image is cropped by the frame.
- No Firebase settings, Firestore rules, or other data-saving code changed.
- This approach preserves the existing Firebase image URLs; it does not replace the stored image files.
