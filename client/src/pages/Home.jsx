import { useState, useEffect } from 'react'
import '../index.css'
import { Plus, ArrowUp, ArrowDown } from 'react-feather'

export default function Home() {
  const lists = [
    {
      id: '1',
      name: 'Dana Keen',
      chains: 'Tbh, i do not know what to write here',
      x: 'https://x.com/user',
      tg: 'https://telegram.com/user',
      currentcalls: 'https://cc.com/user',
      votes: '0'
    },
    {
      id: '2',
      name: 'Jane Doe',
      chains: 'Tbh, i do not know what to write here',
      x: 'https://x.com/user',
      tg: 'https://telegram.com/user',
      currentcalls: 'https://cc.com/user',
      votes: '-10'
    },
    {
      id: '3',
      name: 'Peterson West',
      chains: 'Tbh, i do not know what to write here',
      x: 'https://x.com/user',
      tg: 'https://telegram.com/user',
      currentcalls: 'https://cc.com/user',
      votes: '2.1k'
    }
  ]
  
  const [showUploader, shouldShowUploader] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  
  // State for uploader inputs
  const [inputs, setInputs] = useState({
    password: '',
    name: '',
    x: '',
    tg: '',
    chains: '',
    currentCalls: '',
    image: null
  })

  const handleKeyDown = (event) => {
    if (event.ctrlKey && (event.key === 'x' || event.key === 'X')) {
      shouldShowUploader(true)
    }
  }

  const handleBodyClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1
      if (newCount >= 7) {
        shouldShowUploader(true)
        return 0 // Reset click count
      }
      return newCount
    })
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    document.body.addEventListener('click', handleBodyClick)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.removeEventListener('click', handleBodyClick)
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setInputs((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setInputs((prev) => ({ ...prev, image: e.target.files[0] }))
    }
  }

  const handleSubmit = () => {
    const { password, name, x, tg, chains, currentCalls } = inputs
    if (password && name && x && tg && chains && currentCalls) {
      console.log('Inputs:', inputs)
      // Add your upload logic here
      shouldShowUploader(false) // Close uploader after submit
    }
  }

  const isSubmitDisabled = Object.values(inputs).some(input => input === '' || input === null)

  return (
    <>
      <div>
        <div id='home-table-cont'>
          <table id='home-table'>
            <thead>
              <tr>
                <th id='home-table-header-fchild'>ID</th>
                <th>Votes</th>
                <th>Photo</th>
                <th>Name</th>
                <th>X</th>
                <th>TG</th>
                <th>Chains</th>
                <th id='home-table-header-lchild'>Current Calls</th>
              </tr>
            </thead>
            <tbody>
              {lists.map((list, index) => (
                <tr key={index} id={list.id} className='home-table-databody'>
                  <td className='home-table-data'>{list.id}</td>
                  <td className='home-table-data'>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'center', width: '2.3em' }}>
                      <ArrowUp width={20} fill={'rgba(105, 105, 105, 0.7)'} stroke={'rgba(105, 105, 105, 0.7)'} />
                      <div style={{ fontFamily: 'poppins', fontSize: 14, color: list.votes.startsWith('-') ? 'tomato' : 'rgba(105, 105, 105, 0.7)' }}>{list.votes}</div>
                      <ArrowDown width={20} fill={'rgba(105, 105, 105, 0.7)'} stroke={'rgba(105, 105, 105, 0.7)'} style={{ marginTop: '-0.2em' }} />
                    </div>
                  </td>
                  <td className='home-table-data'><img className='home-table-data-profile' src={list.photo} /></td>
                  <td className='home-table-data'>{list.name}</td>
                  <td className='home-table-data'><a href={list.x}>{list.x}</a></td>
                  <td className='home-table-data'><a href={list.tg}>{list.tg}</a></td>
                  <td className='home-table-data'>{list.chains}</td>
                  <td className='home-table-data'><a href={list.currentcalls}>{list.currentcalls}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button id='home-loadmore'>Load more</button>
      </div>

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
              <button className='home-uploader-footer-btn' onClick={() => shouldShowUploader(false)}>Close</button>
              <button className='home-uploader-footer-btn' onClick={handleSubmit} style={{ backgroundColor: 'dodgerblue', color: 'white', fontFamily: 'poppins' }} disabled={isSubmitDisabled}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
