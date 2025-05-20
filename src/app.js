document.addEventListener('DOMContentLoaded', () => {
    const getAllBtn = document.getElementById('getAllBtn');
    const getByIdBtn = document.getElementById('getByIdBtn');
    const userIdInput = document.getElementById('userId');
    const dataContainer = document.getElementById('data');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

    const API_URL = 'https://jsonplaceholder.typicode.com/users';
    
    const showLoading = () => {
        loadingElement.innerHTML = 'CARGANDO...<span class="blink">_</span>';
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        dataContainer.innerHTML = '';
    };
    
    const hideLoading = () => {
        loadingElement.classList.add('hidden');
    };
    
    const showError = (message) => {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    };

    const createUserCard = (user) => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';

        userCard.innerHTML = `
            <h3>[ ${user.name} ]</h3>
            <div class="user-property"><span>> ID:</span> ${user.id}</div>
            <div class="user-property"><span>> Username:</span> ${user.username}</div>
            <div class="user-property"><span>> Email:</span> ${user.email}</div>
            <div class="user-property"><span>> Teléfono:</span> ${user.phone}</div>
            <div class="user-property"><span>> Website:</span> ${user.website}</div>
            <div class="user-property">
                <span>> Dirección:</span> 
                ${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}
            </div>
            <div class="user-property">
                <span>> Empresa:</span> 
                ${user.company.name} - ${user.company.catchPhrase}
            </div>
        `;

        return userCard;
    };

    const getAllUsers = async () => {
        try {
            showLoading();
            
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const users = await response.json();
            
            if (users.length === 0) {
                dataContainer.innerHTML = '<p>No se encontraron usuarios</p>';
                return;
            }
            
            dataContainer.innerHTML = '';
            users.forEach(user => {
                dataContainer.appendChild(createUserCard(user));
            });
        } catch (error) {
            showError(`Error al obtener los usuarios: ${error.message}`);
        } finally {
            hideLoading();
        }
    };
    
    const getUserById = async (id) => {
        try {
            showLoading();
            
            const response = await fetch(`${API_URL}/${id}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`No se encontró un usuario con el ID ${id}`);
                }
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const user = await response.json();
            
            dataContainer.innerHTML = '';
            dataContainer.appendChild(createUserCard(user));
        } catch (error) {
            showError(`Error al obtener el usuario: ${error.message}`);
        } finally {
            hideLoading();
        }
    };

    getAllBtn.addEventListener('click', getAllUsers);
    
    getByIdBtn.addEventListener('click', () => {
        const userId = userIdInput.value.trim();
        
        if (!userId) {
            showError('Por favor, ingrese un ID de usuario');
            return;
        }
        
        getUserById(userId);
    });

    userIdInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            getByIdBtn.click();
        }
    });

    getAllUsers();
});