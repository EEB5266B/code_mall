const pieChartColors = ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#8AC926', '#1982C4', '#F15BB5', '#FF9F40', '#6A4C93', '#9966FF', '#FF6B6B', '#4ECDC4', '#58B19F', '#D64550', '#3E8EDE', '#F7DC6F', '#2ECC71', '#E74C3C', '#3498DB', '#BE90D4']
const searchParams = new URLSearchParams(window.location.search)
const key = searchParams.get('key')
let goods = ''

const detailsModal = document.getElementById('detailsModal')
const exchangeButton = document.getElementById('exchangeButton')
const keyInput = document.getElementById('key')
const toastContainer = document.getElementById('toast-container')

const exchangeButtonLoading = (loading) => {
	if (loading) {
		exchangeButton.disabled = true
		exchangeButton.innerHTML = `
        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        <span role="status">兑换中...</span>
      `
	} else {
		exchangeButton.disabled = false
		exchangeButton.innerHTML = '兑换'
	}
}

// 渲染项目卡片
const renderProjects = (projectsData) => {
	const container = document.getElementById('projects-container')
	container.innerHTML = ''
	projectsData.forEach((project, index) => {
		let language = ''

		Object.entries(project.language).forEach(([key, value], index) => {
			language += `
                <div class="progress" role="progressbar" aria-label="Segment ${key}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100" data-bs-toggle="tooltip" data-bs-title="${key}" style="width: ${value}%">
                    <div class="progress-bar" style="background: ${pieChartColors[index]}"></div>
                </div>
            `
		})

		const projectCard = `
            <div class="col col-lg-3 col-md-12">
                <div class="card project-card">
                    <div class="card-header d-flex justify-content-between">
                        <span>${project.name}</span>
                        <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#detailsModal" data-bs-whatever="${project.name}">详情</button>
                    </div>
                    <div class="card-body">
                        <div>
                            <p class="text-truncate">${project.description}</p>
                        </div>
                        <div>
                            <span class="text-body-secondary">语言：</span>
                            <div class="progress-stacked">
                               ${language}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
		container.innerHTML += projectCard
	})
	const tooltipTriggerList = [...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
	tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))
}

function showToast(title, message, type = 'info') {
	const toastId = 'toast-' + Date.now()

	let bgClass = ''
	switch (type) {
		case 'success':
			bgClass = 'text-bg-success'
			break
		case 'error':
		case 'danger':
			bgClass = 'text-bg-danger'
			break
		case 'warning':
			bgClass = 'text-bg-warning'
			break
		default:
			bgClass = 'text-bg-info'
	}

	const toastHTML = `
		<div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
			<div class="toast-header">
				<span class="badge ${bgClass} me-2">&nbsp;</span>
				<strong class="me-auto">${title}</strong>
				<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
			</div>
			<div class="toast-body">
				${message}
			</div>
		</div>
	`

	toastContainer.insertAdjacentHTML('beforeend', toastHTML)

	const toastElement = document.getElementById(toastId)
	const toast = new bootstrap.Toast(toastElement, {
		autohide: true,
		delay: 5000,
	})
	toast.show()

	toastElement.addEventListener('hidden.bs.toast', () => {
		toastElement.remove()
	})
}

document.addEventListener('DOMContentLoaded', async () => {
	const response = await fetch('/projects.json')
	if (response.ok) {
		const projectsData = await response.json()
		renderProjects(projectsData)
	}
})

detailsModal.addEventListener('show.bs.modal', (event) => {
	goods = event.relatedTarget.getAttribute('data-bs-whatever')
	detailsModal.querySelector('.modal-title').innerHTML = goods

	if (key) {
		keyInput.value = key
		keyInput.disabled = true
	}
})

Array.from(document.querySelectorAll('.needs-validation')).forEach((form) => {
	form.addEventListener(
		'submit',
		async (event) => {
			event.preventDefault()
			event.stopPropagation()

			if (form.checkValidity() && goods) {
				exchangeButtonLoading(true)
				const response = await fetch(`/api/goods/exchange/${goods}/${key | keyInput.value}`)
				exchangeButtonLoading(false)

				if (response.ok) {
					window.location.href = `/api/goods/download/${key | keyInput.value}`
				} else {
					showToast('错误', await response.text(), 'error')
				}
			}

			form.classList.add('was-validated')
		},
		false,
	)
})
