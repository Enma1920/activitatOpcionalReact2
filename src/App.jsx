import { useEffect, useState } from 'react'

function App() {
  const [students, setStudents] = useState([]); // guarda array todos alumnos
  const [nameStudent, setNameStudent]= useState(''); // guarda campo name de cada alumno
  const [ageStudent, setAgeStudent]= useState(''); // guarda campo edat de cada alumno 
  const url = 'http://localhost:6715/alumnes';
  useEffect(() =>{
    fetch(`${url}`).then(response => response.json())
    .then(data => setStudents(data));
  }, []); // primera vez que se ejecuta imprime alumnos

  const handleSubmit = (event)=>{
    event.preventDefault(); 

    const student = students.find(student => student.name === nameStudent); // busca si existe alumno con el mismo nombre
    if(student){
      fetch(`${url}/${student.id}`,{
        method: 'PUT', // si existes nombre alumno sobreescribe alumno y lo actualiza
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: nameStudent, age: ageStudent}),
      }).then(()=> fetch(`${url}`))
      .then(response => response.json())
      .then(data => setStudents(data));
      }else{
        const newId= (students.length +1).toString() ;

        fetch(`${url}`,{
          method: 'POST', // si no existe nombre alumno lo crea con POST
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({id: newId, name: nameStudent, age: ageStudent}),
        }).then(()=> fetch(`${url}`))
        .then(response => response.json())
        .then(data => setStudents(data));
      }

      setNameStudent(''); 
      setAgeStudent(''); // vuelve a poner en blanco los campos del formulario

    }

    const handleDeleteStudent = (id) => {
      fetch(`${url}/${id}`, {
        method: 'DELETE'
      }).then(()=> fetch(`${url}`))
      .then(response => response.json())
      .then(data => setStudents(data));
    };
  

  return (
    <>
    <h1>Formulari per afegir alumne</h1>
    <form onSubmit={handleSubmit}>
      <label htmlFor="nom">Nom alumne:</label>
      <input type="text" id="nom" name="nom" value={nameStudent} onChange={e=>setNameStudent(e.target.value)} />
      <br />
      <label htmlFor="edat">Edat:</label>
      <input type="number" id="edat" name="edat" value={ageStudent} onChange={e=>setAgeStudent(e.target.value)}/>
      <br />
      <button type="submit" onClick={()=> handleSubmit()}>Afegir alumne</button>
    </form>
    <h2>Llistat alumnes: </h2>
    <ul>
      {students.map(student => (
        <li key={student.id}>
          <p>{student.name}</p>
          <p>{student.age}</p>
          <button onClick={() => handleDeleteStudent(student.id)}>Eliminar</button>
        </li>
      ))}
    </ul>
    </>
  )
}

export default App
