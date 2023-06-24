import React, { ChangeEvent } from "react";

const FilePicker: React.FC = () => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const output = document.getElementById("fileListing");
    if (output) {
      const files = event.target.files;
      if (files && files.length > 0) {
        for (const file of files) {
          if (file.webkitRelativePath) {
            const item = document.createElement("li");
            item.textContent = file.webkitRelativePath;
            output.appendChild(item);
          }
        }
      }
    }
  };

  return (
    <div>
        {/* @ts-expect-error */}
        <input id="dirSelect" directory="" type="file" webkitdirectory="" multiple onChange={handleFileChange} />
        <ul id="fileListing"></ul>

    </div>
  );
};

export default FilePicker;
