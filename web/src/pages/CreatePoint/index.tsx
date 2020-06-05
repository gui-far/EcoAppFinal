import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

import { Map, TileLayer, Marker } from 'react-leaflet'

import axios from 'axios'
import api from '../../services/api'

import './styles.css'

import logo from '../../assets/logo.svg'

import { LeafletMouseEvent } from 'leaflet'

import Dropzone from '../../components/Dropzone'

interface Item {
    id: number;
    name: string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla: string
}

interface IBGECityResponse {
    nome: string
}



const CreatePoint = () => {

    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])

    const [selectedUf, setSelectedUf] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')

    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])

    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const [selectedFile, setSelectedFile] = useState<File>()



    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })

    const history = useHistory();

    useEffect(() => {
        api.get('items').then(res => {
            setItems(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
            const ufInitials = res.data.map(uf => uf.sigla)

            setUfs(ufInitials)
        })
    }, [])

    useEffect(() => {
        if (selectedUf === '0') {
            return;
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(res => {
            const cityNames = res.data.map(city => city.nome)

            setCities(cityNames)
        })

    }, [selectedUf])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords

            setInitialPosition([latitude, longitude])
        })
    }, [])

    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value
        setSelectedUf(uf);
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value
        setSelectedCity(city);
    }

    function hangleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setFormData({ ...formData, [name]: value })
    }

    function handleSelectedItem(id: number) {

        const alreadySelected = selectedItems.findIndex(item => item === id)

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems);

        } else {
            setSelectedItems([...selectedItems, id]);
        }


    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;

        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems

        const data = new FormData();


            data.append('name', name)
            data.append('email', email)
            data.append('whatsapp', whatsapp)
            data.append('uf', uf)
            data.append('city', city)
            data.append('latitude', String(latitude))
            data.append('longitude', String(longitude))
            data.append('items', items.join(','))

            if(selectedFile) {
                data.append('image', selectedFile)
            }

        console.log(data);

        await api.post('points', data)

        alert('Ponto de coleta criado')

        history.push('/');

    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1> Cadastro do <br /> Ponto de Coleta </h1>

                <Dropzone onFileUploaded={setSelectedFile}/>


                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input type="text" name="name" id="name" onChange={handleInputChange} />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Nome da Entidade</label>
                            <input type="email" name="email" id="email" onChange={handleInputChange} />
                        </div>
                        <div className="field">
                            <label htmlFor="name">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange} />
                        </div>
                    </div>
                </fieldset>

                <Map center={initialPosition} zoom={15} onclick={hangleMapClick}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker position={selectedPosition} />

                </Map>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectedUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectedCity}>
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id} onClick={() => handleSelectedItem(item.id)} className={selectedItems.includes(item.id) ? 'selected' : ''} >
                                <img src={item.image_url} alt={item.name} />
                                <span>{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">Ponto de Coleta</button>

            </form>

        </div>

    )
}

export default CreatePoint;