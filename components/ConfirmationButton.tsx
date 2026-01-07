import React, { useState } from "react";
import Button from "@/components/ui/Button";
import ConfirmationModal from "@/components/ConfirmationModal";
import { Ionicons } from "@expo/vector-icons";

export type ConfirmationButtonProps = {
  variant?: "button" | "icon";
  iconProps?: React.ComponentProps<typeof Ionicons>;
  buttonProps?: React.ComponentProps<typeof Button> & { text?: string };
  modalProps?: Partial<React.ComponentProps<typeof ConfirmationModal>>;
  onConfirm: () => void;
};

function ConfirmationButton({
  variant = "button",
  iconProps,

  buttonProps = {},
  modalProps = {},
  onConfirm,
}: ConfirmationButtonProps) {
  const [visible, setVisible] = useState(false);

  const handlePress = () => setVisible(true);
  const handleClose = () => setVisible(false);
  const handleConfirm = () => {
    onConfirm();
    setVisible(false);
  };

  return (
    <>
      {variant === "button" ? (
        <Button onPress={handlePress} {...buttonProps}>
          {buttonProps.text}
        </Button>
      ) : (
        <Ionicons
          onPress={handlePress}
          style={{ alignSelf: "center" }}
          {...iconProps}
        />
      )}
      <ConfirmationModal
        visible={visible}
        onClose={handleClose}
        onConfirm={handleConfirm}
        {...modalProps}
      />
    </>
  );
}

export default ConfirmationButton;
