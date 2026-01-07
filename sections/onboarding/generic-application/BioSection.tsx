import TextArea from "@/components/ui/TextArea";
import React from "react";

type BioSectionProps = React.ComponentProps<typeof TextArea>;

function BioSection({ ...props }: BioSectionProps) {
  return (
    <TextArea
      label="Bio"
      placeholder="Enter a short bio"
      numberOfLines={5}
      {...props}
    />
  );
}

export default BioSection;
