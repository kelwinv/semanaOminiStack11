import React, {useState, useEffect} from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiPower, FiTrash2 } from 'react-icons/fi'

import api from '../../Services/api'

import logoimag from '../../assets/logo.svg'

import './styles.css'


export default function Profile(){
    const [incidents, setIncidents] = useState([]);
    
    const history = useHistory();

    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');


    useEffect(() => {
        api.get('profile',{
            headers: {
             authorization: ongId,
            }
        }).then(response => {
            setIncidents(response.data);
        })
    }, [ongId]);

    async function headleDeleteIncident(id){
        try{
          await api.delete(`incidents/${id}`,{
            headers: {
             authorization: ongId,
            }
        });
        setIncidents(incidents.filter(incident => incident.id !== id));
        }catch(err){
          alert('Erro ao deletar caso, tente novamente.')
        }
    }

    function headleLogout(){
        localStorage.clear();

        history.push('/');
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logoimag} alt="Be The Hero"/>
                    <span>Bem vinda, {ongName} </span>

                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>

                <button onClick={headleLogout} type='button'>
                    <FiPower size={18} color="#E02041"/>
                </button>
            </header>

            <h1>Casos registrados</h1>

            <ul>
                {incidents.map(incident => (
                  <li key={incident.id}>
                    <strong>CASO:</strong>
                    <p>{incident.title}</p>

                    <strong>DESCRIÇÃO</strong>
                    <p>{incident.descreption}</p>

                    <strong>VALOR</strong>
                    <p>{Intl.NumberFormat('pt-BR', { style : 'currency', currency : 'BRL'}).format(incident.value)}</p>

                    <button onClick={() => headleDeleteIncident(incident.id) } type = "button">
                        <FiTrash2 size={20} color="#a8a8b3" />
                    </button>
                  </li>
                ))}
            </ul>
        </div>
    )
}