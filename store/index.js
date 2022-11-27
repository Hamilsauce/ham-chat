export const storeObj = {
	state: {
		workHistory: [],
		selectedCardId: 0,
		backup: [],
		showDeleteModal: false,
		showNav: false,
		selectedCardScroll: null,
		selectedCard: null,
		activeRoute: 'cardView'
	},

	mutations: {
		updateActiveRoute(state, data) {
			state.activeRoute = data;
		},
		toggleShowNav(state) {
			state.showNav = !state.showNav;
		},
		toggleDeleteModal(state) {
			state.showDeleteModal = !state.showDeleteModal;
		},

		addShiftToWorkHistory(state, newShift) {
			if (newShift.date) {
				state.workHistory.push({
					...newShift,
					createdDate: dayjs().format('MM/DD/YYYY'),
					id: state.workHistory.length + 1,
					modifiedDate: dayjs().format('MM/DD/YYYY'),
					hours: Number(newShift.hours)
				});
				localStorage.setItem('workHistory', JSON.stringify(state.workHistory))
			}
		},

		setWorkHistory(state, lsData) {
			if (!lsData) {
				state.workHistory = workHistory;
			} else {
				state.workHistory = lsData;
			}
		},

		setSelectedCardId(state, id) {
			state.selectedCardId = id;
		},
		setSelectedCardScroll(state, data) {
			state.selectedCardScroll = data;
		},
		setSelectedCard(state, data) {
			state.selectedCard = data;
		},

		deleteCard(state) {
			state.workHistory = state.workHistory
				.filter(item => {
					return item.id !== state.selectedCardId
				})
			localStorage.setItem('workHistory', JSON.stringify(state.workHistory))
		},

		saveCardEdit(state, editedCard) {
			let targetCard = state.workHistory.find(c => c.id === editedCard.id)

			targetCard.hours = editedCard.hours
			targetCard.details = editedCard.details
			targetCard.modifiedDate = dayjs().format('MM/DD/YYYY')

			localStorage.setItem('workHistory', JSON.stringify(state.workHistory))
		},
	},

	getters: {
		workHistory(state) {
			return state.workHistory;
		},

		selectedCardId(state) {
			return state.selectedCardId;
		},
		selectedCardScroll(state) {
			return state.selectedCardScroll;
		},
		selectedCard(state) {
			return state.selectedCard;
		},
		showNav(state) {
			return state.showNav;
		},
		showDeleteModal(state) {
			return state.showDeleteModal;
		}
	},

	actions: {
		fetchLocalStorageData(context) {
			const lsData = JSON.parse(localStorage.getItem('workHistory')) || [];
			context.commit('setWorkHistory', lsData)
		},
		handleSelectedCard({
			commit,
			state
		}, {
			cardId,
			cardRef
		}) {
			commit('setSelectedCard', cardRef)
			commit('setSelectedCardScroll', state.selectedCard.offsetTop - 55)
			// commit('setSelectedCardScroll', cardRef.offsetTop - 55)
			commit('setSelectedCardId', cardId)
		},

		storeHistory({
			commit,
			state
		}, newData) {
			commit('addShiftToWorkHistory', newData)
			state.workHistory
				.sort((a, b) => {
					const aDate = new Date(a.date)
					const bDate = new Date(b.date)
					return bDate.getMonth() - aDate.getMonth() == 0 ?
						bDate.getDate() - aDate.getDate() :
						bDate.getMonth() - aDate.getMonth();
				});
			state.workHistory.forEach((shift, index, arr) => {
				shift.id = arr.length - index
				shift.hours = Number(shift.hours)
			})
			
				localStorage.setItem('workHistory', JSON.stringify(state.workHistory))
		}
	}
};

export const store = new Vuex.Store(storeObj);

