import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)
// use dev env variable to swicth between localhost and production
const baseUrl = "http://localhost:3000/";
export default new Vuex.Store({
	state: {
		loadedMembers: [],	
		user: null,
		successMsg:"",
		error: "",
		loading: false,
		baseUrl: baseUrl
	},
	/* estos mutation son los metodos q ejecutan acciones a los states como tal */
	mutations: {
		setLoadedMembers (state, payload) {
			state.loadedMembers = payload
		},
		setSuccessMsg(state,payload) {
			state.successMsg = payload;
		},
		setUser(state,payload) {
			state.user = payload;
		},
		setEmptyMembers(state){
			state.loadedMembers = [];
		},
		setError(state,payload) {
			state.error = payload;
		},
		setMember(state,payload) {
			state.loadedMembers.push(payload);
		}
	},
	/* estos son los metodos q se llaman desde otros lugares para interactuar con los estados
	* estos metodos internamente para manipular la informacion llaman a los mutation co el commit */
	actions: {		
		loadMembers ({commit}) {
			console.log('Loading members')
			axios.get(`${baseUrl}members`)
			.then((response) => {
				const members = [];
				const data = response.data.data;
				data.forEach((member, index) =>{
					members.push({
						id: member['id'],
						owner: member.owner,
						company: member.company,
						digitalCard: member.digitalCard,
						phone: member.phone,						
						email: member.email
					})
				});				
				console.table('Members Loaded', members);
				commit('setLoadedMembers', members);
			})
			.catch(
				(error) => {
					console.log(error)
				})
		},	
		deleteMember({commit}, payload){
			axios.get(`${baseUrl}members/delete/${payload.id}`)
			.then( response =>{
				if(response.data.code == 200){
					commit('setEmptyMembers');
					console.log("User Deleted",response);					
					const members = [];
					const data = response.data.data;
					data.forEach((member, index) =>{
						members.push({
							id: member['id'],
							owner: member.owner,
							company: member.company,
							digitalCard: member.digitalCard,
							phone: member.phone,						
							email: member.email
						})
					});				
					commit('setLoadedMembers', members);
					commit('setSuccessMsg', "Miembro borrado correctamente");		
					return;
				}
				return alert('Error al borrar usuario');
			}).catch(
				(error) => {
					console.log(error)
					return alert('Error al borrar usuario');
				})
		},
		registerUser({commit, getters}, payload){
			console.log('Register user')
			const email = payload.email;
			//TODO revisar como hacer hash de esto primero o usar ssl en el server
			const password = payload.password;
			const data = {
				'email': email,
				'password': password
			}
			axios.post(`${baseUrl}register`,data)
			.then( response =>{
				if(response.data.code == 200){
					console.log("Registerd user",response)
					return alert('Usuario creado correctamente');				
				}
				return alert('Error al crear usuario')
			}).catch(
				(error) => {
					console.log(error)
				})
		},				
		registerMember({commit}, payload){
			console.log('Register member')
			const memberData = payload;
		
			axios.post(`${baseUrl}members/add`,memberData)
			.then( response =>{
				if(response.data.code == 200){					
					const memberData = response.data.data;
					console.log("Registerd member",response.data);
					commit('setMember', memberData);
					commit('setSuccessMsg', "Miembro creado correctamente");		
					return;			
				}
				return alert('Error al crear miembro')
			}).catch(
				(error) => {
					console.log(error)
				})
		},
		login({commit}, payload){
			const loginData = payload;
			axios.post(`${baseUrl}login`,loginData)
			.then( response =>{
				if(response.data.code == 200){					
					const userToken = response.data.data;
					console.log("Login ok",response.userToken);
					commit('setUser', userToken);
					return;			
				}
				commit('setError', "Revise los datos de acceso.")
			}).catch(
				(error) => {
					console.log(error)
				})
		},
		logout({commit}){
			commit('setUser',null)
		}
	},
	getters: {
		getMembers (state) {
			return (search) => {
				console.log('Seaching by', search);
				if(search != "" && search.length > 2){
					return state.loadedMembers.filter( member => {
						return member.owner.toLowerCase().includes(search.toLowerCase());
					})					
				}
				return state.loadedMembers;				
			}	
		},
		getMember: (state) => (id) => {
			return state.loadedMembers.find(member => member.id == id);
		},
		getUser: (state) => {
			return state.user;
		},
		getSuccessMsg: (state) => {
			return state.successMsg;
		},
		getError: (state) => {
			return state.error;
		},
		getDigitalCardUrl: (state) => {
			return `${state.baseUrl}images/tarjetas/`;
		}
	}
})
