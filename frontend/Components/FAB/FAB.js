import React, { useState } from "react";
import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";
import Modal from "@components/Modal";
import SearchNote from "@components/SearchNote/SearchNote";

export default function FAB({ icon, textContent, ...rest }) {
  const [showSearchModal, setShowSearchModal] = useState(false);
  return (
    <>
      <button
        type="button"
        className="fab"
        {...rest}
        onClick={() => setShowSearchModal(true)}
      >
        <TextWithIcon
          textContent={textContent}
          pathData={getIconPaths(icon)}
          iconWidth="2rem"
        />
      </button>

      <Modal
        shouldOpen={showSearchModal}
        classToToggle={{
          modal: "modal--search",
          child: "search--active",
        }}
        setStateRef={setShowSearchModal}
      >
        <SearchNote setShowSearchModal={setShowSearchModal} />
      </Modal>
    </>
  );
}
