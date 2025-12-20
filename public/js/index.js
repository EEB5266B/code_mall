const pieChartColors = [
	'#36A2EB', // 天蓝 - 清新、宁静，适合作为起始色。
	'#FF6384', // 玫红 - 充满活力，吸引注意力。
	'#FFCE56', // 明黄 - 温暖明亮，增加积极感。
	'#4BC0C0', // 青绿 - 自然清新，给人舒适之感。
	'#8AC926', // 草绿 - 生机勃勃，代表生长和活力。
	'#1982C4', // 深蓝 - 提供稳定性和深度，增强信任感。
	'#F15BB5', // 亮粉 - 富有趣味性，打破单调。
	'#FF9F40', // 橙色 - 温暖激励，提升整体亮度。
	'#6A4C93', // 葡萄紫 - 带有神秘感，增添奢华气息。
	'#9966FF', // 紫罗兰 - 艺术感强，介于蓝色和红色之间。
	'#FF6B6B', // 柔和红 - 较玫红柔和，但依然醒目。
	'#4ECDC4', // 海蓝 - 更深沉的青绿色调，带来稳重感。
	'#58B19F', // 深海绿 - 类似海蓝，但更加独特。
	'#D64550', // 砖红 - 强烈而温暖，提供良好的对比。
	'#3E8EDE', // 明朗蓝 - 接近天蓝，但更明亮。
	'#F7DC6F', // 淡黄 - 比明黄更为温和，易于配色。
	'#2ECC71', // 亮草绿 - 更加生动的绿色，充满活力。
	'#E74C3C', // 强烈红 - 极具冲击力的颜色。
	'#3498DB', // 宝石蓝 - 深邃且富有吸引力。
	'#BE90D4', // 浅紫 - 温柔而不失特色，为列表添加一些轻盈感。
]
const detailsModal = document.getElementById('detailsModal')
detailsModal.addEventListener('show.bs.modal', (event) => {
	// Button that triggered the modal
	const button = event.relatedTarget
	// Extract info from data-bs-* attributes
	const recipient = button.getAttribute('data-bs-whatever')
	// If necessary, you could initiate an AJAX request here
	// and then do the updating in a callback.
	const modalTitle = detailsModal.querySelector('.modal-title')

	modalTitle.textContent = `${recipient}`
})

// Fetch all the forms we want to apply custom Bootstrap validation styles to
const forms = document.querySelectorAll('.needs-validation')

// Loop over them and prevent submission
Array.from(forms).forEach((form) => {
	form.addEventListener(
		'submit',
		(event) => {
			if (!form.checkValidity()) {
				event.preventDefault()
				event.stopPropagation()
			}

			form.classList.add('was-validated')
		},
		false,
	)
})

// 渲染项目卡片
function renderProjects(projectsData) {
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
	const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
	const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))
}

// 加载 JSON 数据
async function loadProjects() {
	try {
		const response = await fetch('/projects.json')
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		const projectsData = await response.json()
		renderProjects(projectsData)
	} catch (error) {
		console.error('Failed to load projects:', error)
		document.getElementById('loading').classList.add('d-none')
		const errorMsg = document.getElementById('error-message')
		errorMsg.textContent = '❌ 无法加载项目数据，请检查 projects.json 文件是否存在。'
		errorMsg.classList.remove('d-none')
	}
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadProjects)
