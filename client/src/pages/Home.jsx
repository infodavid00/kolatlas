import { useState, useEffect } from 'react';
import '../index.css';
import { Plus, ArrowUp, ArrowDown } from 'react-feather';
import { baseEndpoint } from '../var.jsx';
import { TailSpin } from 'react-loader-spinner';

export default function Home() {
  const [showUploader, setShowUploader] = useState(false);
  const [inputs, setInputs] = useState({
    password: '',
    name: '',
    x: '',
    tg: '',
    chains: '',
    currentCalls: '',
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [records, setRecords] = useState(false);

  const handleKeyDown = (event) => {
    if (event.ctrlKey && (event.key === 'x' || event.key === 'X')) {
      setShowUploader(true);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setInputs((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const handleSubmit = async () => {
    const { password, name, x, tg, chains, currentCalls } = inputs;
    if (password && name && x && tg && chains && currentCalls) {
      setIsSubmitting(true);
      try {
        const response = await fetch(`${baseEndpoint}/records/write`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Srt': 'main',
            'X-application-password': password
          },
          body: JSON.stringify(inputs)
        });
        if (response.ok) {
          setShowUploader(false);
          setRecords([]); // Clear records on new submission
          setCurrentPage(0); // Reset to the first page after submission
          setHasMoreRecords(true); // Reset the hasMoreRecords flag
          fetchRecords(0); // Fetch records again
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isSubmitDisabled = Object.values(inputs).some(input => input === '' || input === null) || isSubmitting;

  useEffect(() => {
   async  function fetchRecords() {
       try {
          const response = await fetch(`${baseEndpoint}/records/read?limited=1&page=0&size=30`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-Srt': 'main'
              }
          });
         if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.length > 0) {
              setRecords(data.data);
            }
         } else {
            throw new Error('Fetching records failed');
         }
       } catch (error) {
          console.error(error);
       } 
    }
    fetchRecords()
  }, []); 

  return (
    <>
      {!Array.isArray(records) ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4em' }}>
          <TailSpin width={20} height={20} color={'blue'} />
        </div>
      ) : (
        <div>
          <div id='home-table-cont'>
            <table id='home-table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Votes</th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>X</th>
                  <th>TG</th>
                  <th>Chains</th>
                  <th>Current Calls</th>
                </tr>
              </thead>
              <tbody>
                {records.map((list, index) => (
                  <tr key={list.id} className='home-table-databody'>
                    <td className='home-table-data' key={index}>{index + 1}</td>
                    <td className='home-table-data'>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'center', width: '2.3em' }}>
                        <ArrowUp width={20} fill={'rgba(105, 105, 105, 0.7)'} />
                        <div style={{ fontFamily: 'poppins', fontSize: 14, color: String(list?.votes).startsWith('-') ? 'tomato' : 'rgba(105, 105, 105, 0.7)' }}>{list?.votes}</div>
                        <ArrowDown width={20} fill={'rgba(105, 105, 105, 0.7)'} style={{ marginTop: '-0.2em' }} />
                      </div>
                    </td>
                    <td className='home-table-data'><img className='home-table-data-profile' src={list?.photo} alt="Profile" /></td>
                    <td className='home-table-data'>{list?.name}</td>
                    <td className='home-table-data'><a href={list?.x}>{list?.x}</a></td>
                    <td className='home-table-data'><a href={list?.tg}>{list?.tg}</a></td>
                    <td className='home-table-data'>{list?.chains}</td>
                    <td className='home-table-data'><a href={list?.currentcalls}>{list?.currentcalls}</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button id='home-loadmore'>Load more</button>
        </div>
      )}

      {showUploader && (
        <div id='tint'>
          <div id='home-upload-cont'>
            <div style={{ fontFamily: 'poppins' }}>Upload Record</div>
            <input type='text' name='password' className='home-uploader-input' placeholder='Root Password' value={inputs.password} onChange={handleInputChange} />
            <input type='text' name='name' className='home-uploader-input' placeholder='Name' value={inputs.name} onChange={handleInputChange} />
            <input type='text' name='x' className='home-uploader-input' placeholder='X' value={inputs.x} onChange={handleInputChange} />
            <input type='text' name='tg' className='home-uploader-input' placeholder='Tg' value={inputs.tg} onChange={handleInputChange} />
            <input type='text' name='chains' className='home-uploader-input' placeholder='Chains' value={inputs.chains} onChange={handleInputChange} />
            <input type='text' name='currentCalls' className='home-uploader-input' placeholder='Current Calls' value={inputs.currentCalls} onChange={handleInputChange} />
            <input type='file' id='file-input' style={{ display: 'none' }} onChange={handleImageChange} />
            <div className='home-uploader-inputupload' onClick={() => document.getElementById('file-input').click()}>
              {inputs.image && <img src={URL.createObjectURL(inputs.image)} alt="Preview" style={{ width: '100%', height: 'auto' }} />}
              <Plus strokeWidth={1} />
            </div>
            <div id='home-uploader-footer'>
              <button className='home-uploader-footer-btn' onClick={() => setShowUploader(false)}>Close</button>
              <button className='home-uploader-footer-btn' onClick={handleSubmit} style={{ backgroundColor: 'dodgerblue', color: 'white', fontFamily: 'poppins' }} disabled={isSubmitDisabled}>
                {!isSubmitting ? 'Upload' : <TailSpin width={20} height={20} color={'white'} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
