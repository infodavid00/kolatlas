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
  const { password, name, x, tg, chains, currentCalls, image } = inputs;
  if (password && name && x && tg && chains && currentCalls) {
    setIsSubmitting(true);

    let imageUrl = '';
    if (image) {
      // Step 2: Upload image to Cloudinary
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'th47zcei'); // Replace with your upload preset

      try {
        const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dxkzodjlu/image/upload', {
          method: 'POST',
          body: formData
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.secure_url; // Get the URL of the uploaded image
        } else {
          throw new Error('Image upload failed');
        }
      } catch (error) {
        console.error(error);
        setIsSubmitting(false);
        return; // Exit if image upload fails
      }
    }

    // Step 3: Submit form data including image URL
    try {
      const response = await fetch(`${baseEndpoint}/records/write`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Srt': 'main',
          'X-application-password': password
        },
        body: JSON.stringify({ ...inputs, image: imageUrl, date: new Date() }) // Include the image URL
      });

      if (response.ok) {
        setShowUploader(false);
        window.location.reload();
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
   async function fetchRecords() {
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

   const [pageNo, setPageNo] = useState(1)
   const [lockGet, shouldLockGet] = useState(false)
   async function fetchRecords() {
       try {
          shouldLockGet(true)
          const response = await fetch(`${baseEndpoint}/records/read?limited=1&page=${pageNo}&size=30`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-Srt': 'main'
              }
          });
         if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.length > 0) {
              setRecords([...records, ...data.data]);
              setPageNo(pageNo + 1)
              shouldLockGet(false)
            }
         } else {
            throw new Error('Fetching records failed');
         }
       } catch (error) {
          console.error(error);
       } 
    }


   async function Vote(id, count) {
       try {
          const response = await fetch(`${baseEndpoint}/records/vote?id=${id}&count=${count}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'X-Srt': 'main'
              }
          });
         if (response.ok) {
           setRecords(records.map(e => {
              const n = {...e}
              if (n._id === id) n.votes = n.votes + count
           	  return n;
           }))
         } else {
            throw new Error('Fetching records failed');
         }
       } catch (error) {
          console.error(error);
       } 
    }



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
                  <th>More</th>
                </tr>
              </thead>
              <tbody>
                {records.map((list, index) => (
                  <tr key={index} className='home-table-databody'>
                    <td className='home-table-data'>{index + 1}</td>
                    <td className='home-table-data'>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'center', width: '2.3em' }}>
                        <ArrowUp width={20} fill={'rgba(105, 105, 105, 0.7)'} onClick={async ()=> await Vote(list._id, 1)} />
                        <div style={{ fontFamily: 'poppins', fontSize: 14, color: String(list?.votes).startsWith('-') ? 'tomato' : 'rgba(105, 105, 105, 0.7)' }}>{list?.votes}</div>
                        <ArrowDown width={20} fill={'rgba(105, 105, 105, 0.7)'} style={{ marginTop: '-0.2em' }} onClick={async ()=> await Vote(list._id, -1)} />
                      </div>
                    </td>
                    <td className='home-table-data'><img className='home-table-data-profile' src={list?.image} /></td>
                    <td className='home-table-data'>{list?.name}</td>
                    <td className='home-table-data'><a href={list?.x}>{list?.x}</a></td>
                    <td className='home-table-data'><a href={list?.tg}>{list?.tg}</a></td>
                    <td className='home-table-data'>{list?.chains}</td>
                    <td className='home-table-data'><a href={list?.currentCalls}>{list?.currentCalls}</a></td>
                    <td className='home-table-data' onClick={()=> window.location.href = '/overview/'+ list._id}>See more</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button id='home-loadmore' disabled={lockGet} onClick={async ()=> {
             if (!lockGet) await fetchRecords()
          }}>Load more</button>
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
