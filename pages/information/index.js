import { useState, useEffect } from 'react';

function Information() {
  const [jamInfo, setJamInfo] = useState();
  const jamId = 'hZLVrK2lhig19cbLuMBx';
  const contentType = 'text/csv';

  useEffect(() => {
    loadInformation();
  }, []);

  // Call the API for a list of Jams
  const loadInformation = async () => {
    await fetch(
      `/api/jam-information?jamId=${encodeURIComponent(
        jamId,
      )}&contentType=${encodeURIComponent(contentType)}`,
    )
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        setJamInfo(data);
      });
  };

  const renderJamInfo = (jamInfo) => {
    return jamInfo;
  };

  const renderLoading = () => <p>Loading...</p>;

  return (
    <div>
      <h1>Information</h1>
      {jamInfo ? renderJamInfo(jamInfo) : renderLoading()}
    </div>
  );
}

export default Information;
