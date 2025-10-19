// Virtual Classroom Application
class VirtualClassroom {
    constructor() {
        this.currentUser = null;
        this.currentView = 'landing';
        this.currentClassroom = null;
        this.currentQuiz = null;
        this.participants = new Map();
        this.messages = [];
        this.videoStreams = new Map();
        this.userSettings = {
            camera: false,
            microphone: false,
            handRaised: false,
            viewMode: 'grid'
        };
        
        // Sample data from the requirements
        this.users = [
            {
                id: 1,
                name: "John Instructor",
                email: "john@school.edu",
                role: "instructor",
                avatar: "👨‍🏫",
                password: "password123"
            },
            {
                id: 2,
                name: "Sarah Student",
                email: "sarah@student.edu",
                role: "student",
                avatar: "👩‍🎓",
                password: "password123"
            },
            {
                id: 3,
                name: "Mike Student",
                email: "mike@student.edu",
                role: "student",
                avatar: "👨‍🎓",
                password: "password123"
            }
        ];
        
        this.classrooms = [
            {
                id: 1,
                title: "Computer Science 101",
                description: "Introduction to Programming",
                instructor: "John Instructor",
                instructorId: 1,
                participants: 15,
                active: true,
                createdAt: new Date('2025-10-15')
            },
            {
                id: 2,
                title: "Data Structures",
                description: "Advanced Programming Concepts",
                instructor: "John Instructor",
                instructorId: 1,
                participants: 12,
                active: false,
                createdAt: new Date('2025-10-14')
            }
        ];
        
        this.quizzes = [
            {
                id: 1,
                title: "JavaScript Basics",
                timeLimit: 10,
                questions: [
                    {
                        question: "What is a variable in JavaScript?",
                        options: ["A container for data", "A function", "A loop", "An object"],
                        correct: 0
                    },
                    {
                        question: "Which keyword declares a constant?",
                        options: ["var", "let", "const", "function"],
                        correct: 2
                    },
                    {
                        question: "What does DOM stand for?",
                        options: ["Data Object Model", "Document Object Model", "Dynamic Object Model", "Digital Object Model"],
                        correct: 1
                    }
                ],
                createdBy: 1,
                roomId: 1
            }
        ];
        
        this.sampleMessages = [
            {
                id: 1,
                sender: "John Instructor",
                senderId: 1,
                message: "Welcome to today's class! We'll be covering arrays and objects.",
                timestamp: this.formatTime(new Date()),
                room: 1
            },
            {
                id: 2,
                sender: "Sarah Student",
                senderId: 2,
                message: "Thank you professor! I have a question about array methods.",
                timestamp: this.formatTime(new Date()),
                room: 1
            },
            {
                id: 3,
                sender: "Mike Student",
                senderId: 3,
                message: "Can you share the slides?",
                timestamp: this.formatTime(new Date()),
                room: 1
            }
        ];
        
        this.quizTimer = null;
        this.quizStartTime = null;
        this.currentQuizAnswers = [];
        this.currentQuestionIndex = 0;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showView('landing');
    }
    
    bindEvents() {
        // Auth events
        document.getElementById('showSignup')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAuthForms('signup');
        });
        
        document.getElementById('showLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAuthForms('login');
        });
        
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        document.getElementById('signupFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });
        
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.handleLogout();
        });
        
        // Dashboard events
        document.getElementById('createClassroomBtn')?.addEventListener('click', () => {
            this.showCreateClassroomModal();
        });
        
        document.getElementById('refreshClassrooms')?.addEventListener('click', () => {
            this.loadDashboard();
        });
        
        // Classroom creation modal
        document.getElementById('closeCreateModal')?.addEventListener('click', () => {
            this.hideCreateClassroomModal();
        });
        
        document.getElementById('cancelCreate')?.addEventListener('click', () => {
            this.hideCreateClassroomModal();
        });
        
        document.getElementById('createClassroomForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateClassroom();
        });
        
        // Classroom view events
        document.getElementById('leaveClassroomBtn')?.addEventListener('click', () => {
            this.leaveClassroom();
        });
        
        // Video controls
        document.getElementById('toggleCamera')?.addEventListener('click', () => {
            this.toggleCamera();
        });
        
        document.getElementById('toggleMic')?.addEventListener('click', () => {
            this.toggleMicrophone();
        });
        
        document.getElementById('shareScreen')?.addEventListener('click', () => {
            this.toggleScreenShare();
        });
        
        document.getElementById('raiseHand')?.addEventListener('click', () => {
            this.toggleHandRaise();
        });
        
        document.getElementById('toggleView')?.addEventListener('click', () => {
            this.toggleViewMode();
        });
        
        // Sidebar tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });
        
        // Chat
        document.getElementById('sendMessageBtn')?.addEventListener('click', () => {
            this.sendMessage();
        });
        
        document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Quiz events
        document.getElementById('startQuizBtn')?.addEventListener('click', () => {
            this.startQuiz();
        });
        
        document.getElementById('createQuizBtn')?.addEventListener('click', () => {
            this.showCreateQuizModal();
        });
        
        // Quiz creation modal
        document.getElementById('closeQuizModal')?.addEventListener('click', () => {
            this.hideCreateQuizModal();
        });
        
        document.getElementById('cancelQuizCreate')?.addEventListener('click', () => {
            this.hideCreateQuizModal();
        });
        
        document.getElementById('addQuestionBtn')?.addEventListener('click', () => {
            this.addQuizQuestion();
        });
        
        document.getElementById('createQuizForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateQuiz();
        });
        
        // Quiz taking
        document.getElementById('nextQuestionBtn')?.addEventListener('click', () => {
            this.nextQuestion();
        });
        
        document.getElementById('prevQuestionBtn')?.addEventListener('click', () => {
            this.prevQuestion();
        });
        
        document.getElementById('submitQuizBtn')?.addEventListener('click', () => {
            this.submitQuiz();
        });
        
        // Quiz results modal
        document.getElementById('closeResultsModal')?.addEventListener('click', () => {
            this.hideQuizResultsModal();
        });
        
        // Toast close
        document.getElementById('toastClose')?.addEventListener('click', () => {
            this.hideToast();
        });
        
        // Modal backdrop clicks
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }
    
    // Authentication methods
    toggleAuthForms(form) {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        
        if (form === 'signup') {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        } else {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        }
    }
    
    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        this.showLoading();
        
        // Simulate API call
        await this.delay(1000);
        
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.showToast('Login successful! Welcome to EduSpace.', 'success');
            this.showView('dashboard');
            this.loadDashboard();
        } else {
            this.showToast('Invalid email or password. Please try again.', 'error');
        }
        
        this.hideLoading();
    }
    
    async handleSignup() {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const role = document.getElementById('signupRole').value;
        
        this.showLoading();
        
        // Simulate API call
        await this.delay(1000);
        
        // Check if email already exists
        if (this.users.find(u => u.email === email)) {
            this.showToast('Email already registered. Please use a different email.', 'error');
            this.hideLoading();
            return;
        }
        
        const newUser = {
            id: this.users.length + 1,
            name,
            email,
            password,
            role,
            avatar: role === 'instructor' ? '👨‍🏫' : '👩‍🎓'
        };
        
        this.users.push(newUser);
        this.currentUser = newUser;
        
        this.showToast('Account created successfully! Welcome to EduSpace.', 'success');
        this.showView('dashboard');
        this.loadDashboard();
        
        this.hideLoading();
    }
    
    handleLogout() {
        this.currentUser = null;
        this.currentClassroom = null;
        this.participants.clear();
        this.messages = [];
        this.showView('landing');
        this.showToast('Logged out successfully.', 'info');
    }
    
    // View management
    showView(viewName) {
        // Hide all views
        document.querySelectorAll('section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show target view
        const targetView = document.getElementById(viewName === 'landing' ? 'landingPage' : viewName);
        if (targetView) {
            targetView.style.display = 'block';
        }
        
        // Show/hide navigation
        const navHeader = document.getElementById('navHeader');
        if (viewName === 'landing') {
            navHeader.style.display = 'none';
        } else {
            navHeader.style.display = 'block';
            this.updateUserInfo();
        }
        
        this.currentView = viewName;
    }
    
    updateUserInfo() {
        if (this.currentUser) {
            document.getElementById('userAvatar').textContent = this.currentUser.avatar;
            document.getElementById('userName').textContent = this.currentUser.name;
        }
    }
    
    // Dashboard methods
    loadDashboard() {
        this.updateDashboardStats();
        this.renderClassrooms();
        
        // Show create classroom button for instructors
        const createBtn = document.getElementById('createClassroomBtn');
        if (this.currentUser && this.currentUser.role === 'instructor') {
            createBtn.style.display = 'block';
        } else {
            createBtn.style.display = 'none';
        }
    }
    
    updateDashboardStats() {
        const totalClassrooms = this.classrooms.length;
        const activeClassrooms = this.classrooms.filter(c => c.active).length;
        const totalParticipants = this.classrooms.reduce((sum, c) => sum + c.participants, 0);
        
        document.getElementById('totalClassrooms').textContent = totalClassrooms;
        document.getElementById('activeClassrooms').textContent = activeClassrooms;
        document.getElementById('totalParticipants').textContent = totalParticipants;
    }
    
    renderClassrooms() {
        const grid = document.getElementById('classroomsGrid');
        grid.innerHTML = '';
        
        this.classrooms.forEach(classroom => {
            const card = this.createClassroomCard(classroom);
            grid.appendChild(card);
        });
    }
    
    createClassroomCard(classroom) {
        const card = document.createElement('div');
        card.className = 'classroom-card';
        card.innerHTML = `
            <div class="classroom-card-header">
                <h3 class="classroom-title">${classroom.title}</h3>
                <p class="classroom-instructor">👨‍🏫 ${classroom.instructor}</p>
            </div>
            <div class="classroom-card-body">
                <p class="classroom-description">${classroom.description}</p>
                <div class="classroom-meta">
                    <span class="classroom-participants">👥 ${classroom.participants} participants</span>
                    <span class="classroom-status ${classroom.active ? 'active' : 'inactive'}">
                        ${classroom.active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            this.joinClassroom(classroom);
        });
        
        return card;
    }
    
    // Classroom creation
    showCreateClassroomModal() {
        document.getElementById('createClassroomModal').style.display = 'flex';
    }
    
    hideCreateClassroomModal() {
        document.getElementById('createClassroomModal').style.display = 'none';
        document.getElementById('createClassroomForm').reset();
    }
    
    async handleCreateClassroom() {
        const title = document.getElementById('classroomTitle').value;
        const description = document.getElementById('classroomDescription').value;
        
        this.showLoading();
        
        // Simulate API call
        await this.delay(800);
        
        const newClassroom = {
            id: this.classrooms.length + 1,
            title,
            description,
            instructor: this.currentUser.name,
            instructorId: this.currentUser.id,
            participants: 1,
            active: true,
            createdAt: new Date()
        };
        
        this.classrooms.push(newClassroom);
        this.hideCreateClassroomModal();
        this.loadDashboard();
        
        this.showToast('Classroom created successfully!', 'success');
        this.hideLoading();
    }
    
    // Classroom joining and management
    async joinClassroom(classroom) {
        this.showLoading();
        
        // Simulate joining delay
        await this.delay(1000);
        
        this.currentClassroom = classroom;
        this.showView('classroomView');
        this.initializeClassroom();
        
        this.showToast(`Joined ${classroom.title} successfully!`, 'success');
        this.hideLoading();
    }
    
    initializeClassroom() {
        // Update classroom header
        document.getElementById('classroomTitle').textContent = this.currentClassroom.title;
        
        // Initialize participants
        this.initializeParticipants();
        
        // Initialize video streams
        this.initializeVideoStreams();
        
        // Load chat messages
        this.loadChatMessages();
        
        // Setup quiz controls for instructors
        this.setupQuizControls();
        
        // Update participant count
        this.updateParticipantCount();
    }
    
    initializeParticipants() {
        this.participants.clear();
        
        // Add sample participants
        const sampleParticipants = [
            { ...this.users[0], online: true, camera: true, microphone: true, handRaised: false },
            { ...this.users[1], online: true, camera: false, microphone: true, handRaised: false },
            { ...this.users[2], online: true, camera: true, microphone: false, handRaised: true }
        ];
        
        sampleParticipants.forEach(p => {
            this.participants.set(p.id, p);
        });
        
        this.renderParticipants();
    }
    
    renderParticipants() {
        const list = document.getElementById('participantsList');
        list.innerHTML = '';
        
        this.participants.forEach(participant => {
            const item = this.createParticipantItem(participant);
            list.appendChild(item);
        });
    }
    
    createParticipantItem(participant) {
        const item = document.createElement('div');
        item.className = 'participant-item';
        item.innerHTML = `
            <span class="participant-avatar">${participant.avatar}</span>
            <div class="participant-info">
                <div class="participant-name">${participant.name}</div>
                <div class="participant-role">${participant.role}</div>
            </div>
            <div class="participant-indicators">
                <div class="participant-indicator ${participant.camera ? '' : 'camera-off'}" title="Camera ${participant.camera ? 'On' : 'Off'}"></div>
                <div class="participant-indicator ${participant.microphone ? '' : 'mic-off'}" title="Microphone ${participant.microphone ? 'On' : 'Off'}"></div>
                ${participant.handRaised ? '<div class="participant-indicator hand-raised" title="Hand Raised"></div>' : ''}
            </div>
        `;
        
        return item;
    }
    
    updateParticipantCount() {
        const count = this.participants.size;
        document.getElementById('participantCount').textContent = `${count} participant${count !== 1 ? 's' : ''}`;
    }
    
    // Video streaming simulation
    initializeVideoStreams() {
        const videoGrid = document.getElementById('videoGrid');
        videoGrid.innerHTML = '';
        
        this.participants.forEach(participant => {
            const stream = this.createVideoStream(participant);
            videoGrid.appendChild(stream);
        });
    }
    
    createVideoStream(participant) {
        const stream = document.createElement('div');
        stream.className = 'video-stream';
        stream.innerHTML = `
            <div style="font-size: 4rem;">${participant.avatar}</div>
            <div class="video-overlay">
                <span class="participant-name">${participant.name}</span>
                <div class="participant-status">
                    <div class="status-indicator ${participant.microphone ? '' : 'muted'}"></div>
                </div>
            </div>
        `;
        
        return stream;
    }
    
    // Video controls
    toggleCamera() {
        this.userSettings.camera = !this.userSettings.camera;
        const btn = document.getElementById('toggleCamera');
        
        if (this.userSettings.camera) {
            btn.classList.add('active');
            this.showToast('Camera turned on', 'success');
        } else {
            btn.classList.remove('active');
            this.showToast('Camera turned off', 'info');
        }
        
        this.updateUserParticipantState();
    }
    
    toggleMicrophone() {
        this.userSettings.microphone = !this.userSettings.microphone;
        const btn = document.getElementById('toggleMic');
        
        if (this.userSettings.microphone) {
            btn.classList.remove('danger');
            btn.classList.add('active');
            this.showToast('Microphone unmuted', 'success');
        } else {
            btn.classList.remove('active');
            btn.classList.add('danger');
            this.showToast('Microphone muted', 'info');
        }
        
        this.updateUserParticipantState();
    }
    
    toggleScreenShare() {
        const btn = document.getElementById('shareScreen');
        const isSharing = btn.classList.contains('active');
        
        if (isSharing) {
            btn.classList.remove('active');
            this.showToast('Screen sharing stopped', 'info');
        } else {
            btn.classList.add('active');
            this.showToast('Screen sharing started', 'success');
        }
    }
    
    toggleHandRaise() {
        this.userSettings.handRaised = !this.userSettings.handRaised;
        const btn = document.getElementById('raiseHand');
        
        if (this.userSettings.handRaised) {
            btn.classList.add('active');
            this.showToast('Hand raised', 'info');
        } else {
            btn.classList.remove('active');
            this.showToast('Hand lowered', 'info');
        }
        
        this.updateUserParticipantState();
    }
    
    toggleViewMode() {
        this.userSettings.viewMode = this.userSettings.viewMode === 'grid' ? 'speaker' : 'grid';
        const btn = document.getElementById('toggleView');
        
        if (this.userSettings.viewMode === 'speaker') {
            btn.querySelector('.control-label').textContent = 'Speaker View';
            this.showToast('Switched to speaker view', 'info');
        } else {
            btn.querySelector('.control-label').textContent = 'Grid View';
            this.showToast('Switched to grid view', 'info');
        }
    }
    
    updateUserParticipantState() {
        if (this.currentUser) {
            const userParticipant = this.participants.get(this.currentUser.id);
            if (userParticipant) {
                userParticipant.camera = this.userSettings.camera;
                userParticipant.microphone = this.userSettings.microphone;
                userParticipant.handRaised = this.userSettings.handRaised;
                
                this.renderParticipants();
                this.initializeVideoStreams();
            }
        }
    }
    
    // Tab switching
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetTab = tabName === 'chat' ? 'chatTab' : 
                         tabName === 'participants' ? 'participantsTab' : 'quizTabContent';
        document.getElementById(targetTab).classList.add('active');
    }
    
    // Chat functionality
    loadChatMessages() {
        this.messages = [...this.sampleMessages];
        this.renderChatMessages();
    }
    
    renderChatMessages() {
        const container = document.getElementById('chatMessages');
        container.innerHTML = '';
        
        this.messages.forEach(message => {
            const messageEl = this.createChatMessage(message);
            container.appendChild(messageEl);
        });
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }
    
    createChatMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message';
        
        const isOwnMessage = this.currentUser && message.senderId === this.currentUser.id;
        
        messageEl.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${message.sender}</span>
                <span class="message-time">${message.timestamp}</span>
            </div>
            <div class="message-content ${isOwnMessage ? 'own' : ''}">
                ${message.message}
            </div>
        `;
        
        return messageEl;
    }
    
    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (message && this.currentUser) {
            const newMessage = {
                id: this.messages.length + 1,
                sender: this.currentUser.name,
                senderId: this.currentUser.id,
                message: message,
                timestamp: this.formatTime(new Date()),
                room: this.currentClassroom.id
            };
            
            this.messages.push(newMessage);
            this.renderChatMessages();
            
            input.value = '';
            
            // Simulate other participants typing back occasionally
            if (Math.random() > 0.7) {
                setTimeout(() => {
                    this.simulateIncomingMessage();
                }, 1000 + Math.random() * 3000);
            }
        }
    }
    
    simulateIncomingMessage() {
        const responses = [
            "Great question!",
            "Thanks for sharing that.",
            "I agree with that point.",
            "Could you explain that further?",
            "That's very helpful, thank you!",
            "I have a follow-up question...",
            "Interesting perspective!"
        ];
        
        const otherParticipants = Array.from(this.participants.values())
            .filter(p => p.id !== this.currentUser.id);
        
        if (otherParticipants.length > 0) {
            const randomParticipant = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            const incomingMessage = {
                id: this.messages.length + 1,
                sender: randomParticipant.name,
                senderId: randomParticipant.id,
                message: randomResponse,
                timestamp: this.formatTime(new Date()),
                room: this.currentClassroom.id
            };
            
            this.messages.push(incomingMessage);
            this.renderChatMessages();
        }
    }
    
    // Quiz functionality
    setupQuizControls() {
        const controls = document.getElementById('quizControls');
        
        if (this.currentUser && this.currentUser.role === 'instructor') {
            controls.style.display = 'flex';
        } else {
            controls.style.display = 'none';
        }
        
        this.renderQuizPlaceholder();
    }
    
    renderQuizPlaceholder() {
        const container = document.getElementById('quizContainer');
        container.innerHTML = `
            <div class="quiz-placeholder">
                📝 No active quiz.<br>
                ${this.currentUser && this.currentUser.role === 'instructor' ? 
                    'Create or start a quiz to engage students.' : 
                    'Wait for the instructor to start a quiz.'}
            </div>
        `;
    }
    
    showCreateQuizModal() {
        document.getElementById('createQuizModal').style.display = 'flex';
    }
    
    hideCreateQuizModal() {
        document.getElementById('createQuizModal').style.display = 'none';
        document.getElementById('createQuizForm').reset();
        
        // Reset to single question
        const questionsContainer = document.getElementById('quizQuestions');
        const questions = questionsContainer.querySelectorAll('.question-item');
        for (let i = 1; i < questions.length; i++) {
            questions[i].remove();
        }
    }
    
    addQuizQuestion() {
        const questionsContainer = document.getElementById('quizQuestions');
        const currentQuestions = questionsContainer.querySelectorAll('.question-item').length;
        const questionNumber = currentQuestions + 1;
        
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        questionItem.innerHTML = `
            <div class="form-group">
                <label class="form-label">Question ${questionNumber}</label>
                <input type="text" class="form-control question-input" placeholder="Enter your question" required>
            </div>
            <div class="options-container">
                <div class="form-group">
                    <label class="form-label">Options</label>
                    <div class="option-inputs">
                        <div class="option-row">
                            <input type="radio" name="correct-${currentQuestions}" value="0" required>
                            <input type="text" class="form-control option-input" placeholder="Option A" required>
                        </div>
                        <div class="option-row">
                            <input type="radio" name="correct-${currentQuestions}" value="1" required>
                            <input type="text" class="form-control option-input" placeholder="Option B" required>
                        </div>
                        <div class="option-row">
                            <input type="radio" name="correct-${currentQuestions}" value="2" required>
                            <input type="text" class="form-control option-input" placeholder="Option C" required>
                        </div>
                        <div class="option-row">
                            <input type="radio" name="correct-${currentQuestions}" value="3" required>
                            <input type="text" class="form-control option-input" placeholder="Option D" required>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        questionsContainer.appendChild(questionItem);
    }
    
    async handleCreateQuiz() {
        const title = document.getElementById('quizTitle').value;
        const timeLimit = parseInt(document.getElementById('quizTimeLimit').value);
        
        const questions = [];
        const questionItems = document.querySelectorAll('.question-item');
        
        questionItems.forEach((item, index) => {
            const questionText = item.querySelector('.question-input').value;
            const options = Array.from(item.querySelectorAll('.option-input')).map(input => input.value);
            const correctAnswer = parseInt(item.querySelector(`input[name="correct-${index}"]:checked`).value);
            
            questions.push({
                question: questionText,
                options: options,
                correct: correctAnswer
            });
        });
        
        this.showLoading();
        
        // Simulate API call
        await this.delay(800);
        
        const newQuiz = {
            id: this.quizzes.length + 1,
            title,
            timeLimit,
            questions,
            createdBy: this.currentUser.id,
            roomId: this.currentClassroom.id
        };
        
        this.quizzes.push(newQuiz);
        this.hideCreateQuizModal();
        
        this.showToast('Quiz created successfully!', 'success');
        this.hideLoading();
    }
    
    startQuiz() {
        // Find quiz for current classroom
        const quiz = this.quizzes.find(q => q.roomId === this.currentClassroom.id);
        
        if (!quiz) {
            this.showToast('No quiz available for this classroom.', 'error');
            return;
        }
        
        this.currentQuiz = quiz;
        this.currentQuestionIndex = 0;
        this.currentQuizAnswers = [];
        this.quizStartTime = Date.now();
        
        this.showTakeQuizModal();
        this.renderCurrentQuestion();
        this.startQuizTimer();
        
        this.showToast('Quiz started! Good luck!', 'info');
    }
    
    showTakeQuizModal() {
        const modal = document.getElementById('takeQuizModal');
        modal.style.display = 'flex';
        
        document.getElementById('activeQuizTitle').textContent = this.currentQuiz.title;
    }
    
    hideTakeQuizModal() {
        document.getElementById('takeQuizModal').style.display = 'none';
        this.stopQuizTimer();
    }
    
    startQuizTimer() {
        const timerEl = document.getElementById('quizTimer');
        let timeLeft = this.currentQuiz.timeLimit * 60; // Convert to seconds
        
        this.quizTimer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                this.submitQuiz();
                return;
            }
            
            timeLeft--;
        }, 1000);
    }
    
    stopQuizTimer() {
        if (this.quizTimer) {
            clearInterval(this.quizTimer);
            this.quizTimer = null;
        }
    }
    
    renderCurrentQuestion() {
        const container = document.getElementById('quizQuestionContainer');
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        
        container.innerHTML = `
            <div class="quiz-question">
                <h4 class="question-text">${question.question}</h4>
                <div class="question-options">
                    ${question.options.map((option, index) => `
                        <div class="option-item" data-option="${index}">
                            <div class="option-radio"></div>
                            <span class="option-text">${option}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Add click handlers for options
        container.querySelectorAll('.option-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectQuizOption(parseInt(item.dataset.option));
            });
        });
        
        // Update progress
        this.updateQuizProgress();
        
        // Update navigation buttons
        this.updateQuizNavigation();
        
        // Restore previous answer if exists
        if (this.currentQuizAnswers[this.currentQuestionIndex] !== undefined) {
            this.selectQuizOption(this.currentQuizAnswers[this.currentQuestionIndex]);
        }
    }
    
    selectQuizOption(optionIndex) {
        // Remove previous selection
        document.querySelectorAll('.option-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Add selection to clicked option
        document.querySelector(`[data-option="${optionIndex}"]`).classList.add('selected');
        
        // Store answer
        this.currentQuizAnswers[this.currentQuestionIndex] = optionIndex;
    }
    
    updateQuizProgress() {
        const progressFill = document.getElementById('quizProgress');
        const progressText = document.getElementById('progressText');
        
        const progress = ((this.currentQuestionIndex + 1) / this.currentQuiz.questions.length) * 100;
        progressFill.style.width = `${progress}%`;
        
        progressText.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.currentQuiz.questions.length}`;
    }
    
    updateQuizNavigation() {
        const prevBtn = document.getElementById('prevQuestionBtn');
        const nextBtn = document.getElementById('nextQuestionBtn');
        const submitBtn = document.getElementById('submitQuizBtn');
        
        prevBtn.style.display = this.currentQuestionIndex > 0 ? 'block' : 'none';
        
        const isLastQuestion = this.currentQuestionIndex === this.currentQuiz.questions.length - 1;
        nextBtn.style.display = isLastQuestion ? 'none' : 'block';
        submitBtn.style.display = isLastQuestion ? 'block' : 'none';
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
            this.currentQuestionIndex++;
            this.renderCurrentQuestion();
        }
    }
    
    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderCurrentQuestion();
        }
    }
    
    async submitQuiz() {
        this.stopQuizTimer();
        this.hideTakeQuizModal();
        
        this.showLoading();
        
        // Simulate processing
        await this.delay(1000);
        
        // Calculate results
        const results = this.calculateQuizResults();
        
        this.hideLoading();
        this.showQuizResults(results);
    }
    
    calculateQuizResults() {
        let correctAnswers = 0;
        const questionResults = [];
        
        this.currentQuiz.questions.forEach((question, index) => {
            const userAnswer = this.currentQuizAnswers[index];
            const isCorrect = userAnswer === question.correct;
            
            if (isCorrect) {
                correctAnswers++;
            }
            
            questionResults.push({
                question: question.question,
                correct: isCorrect,
                userAnswer: userAnswer !== undefined ? question.options[userAnswer] : 'Not answered',
                correctAnswer: question.options[question.correct]
            });
        });
        
        const score = Math.round((correctAnswers / this.currentQuiz.questions.length) * 100);
        const timeTaken = Math.round((Date.now() - this.quizStartTime) / 1000);
        
        return {
            score,
            correctAnswers,
            totalQuestions: this.currentQuiz.questions.length,
            timeTaken,
            questionResults
        };
    }
    
    showQuizResults(results) {
        const modal = document.getElementById('quizResultsModal');
        const container = document.getElementById('quizResults');
        
        const minutes = Math.floor(results.timeTaken / 60);
        const seconds = results.timeTaken % 60;
        
        container.innerHTML = `
            <div class="result-score">${results.score}%</div>
            <div class="result-summary">
                You answered ${results.correctAnswers} out of ${results.totalQuestions} questions correctly.<br>
                Time taken: ${minutes}:${seconds.toString().padStart(2, '0')}
            </div>
            
            <div class="result-details">
                <h4>Question Details:</h4>
                ${results.questionResults.map((result, index) => `
                    <div class="result-item">
                        <div class="result-question">Q${index + 1}: ${result.question}</div>
                        <div class="result-status ${result.correct ? 'correct' : 'incorrect'}">
                            ${result.correct ? 'Correct' : 'Incorrect'}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        modal.style.display = 'flex';
        
        // Show toast with overall result
        const resultMessage = results.score >= 70 ? 
            `Excellent! You scored ${results.score}%` : 
            results.score >= 50 ? 
                `Good job! You scored ${results.score}%` : 
                `Keep practicing! You scored ${results.score}%`;
        
        this.showToast(resultMessage, results.score >= 70 ? 'success' : 'info');
    }
    
    hideQuizResultsModal() {
        document.getElementById('quizResultsModal').style.display = 'none';
        this.currentQuiz = null;
        this.currentQuizAnswers = [];
        this.currentQuestionIndex = 0;
    }
    
    // Leave classroom
    leaveClassroom() {
        this.currentClassroom = null;
        this.participants.clear();
        this.messages = [];
        
        this.showView('dashboard');
        this.loadDashboard();
        
        this.showToast('Left classroom successfully.', 'info');
    }
    
    // Utility methods
    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }
    
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }
    
    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }
    
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const messageEl = document.getElementById('toastMessage');
        
        messageEl.textContent = message;
        
        // Add type-specific styling
        toast.className = `toast ${type}`;
        
        // Show toast
        toast.classList.add('show');
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            this.hideToast();
        }, 4000);
    }
    
    hideToast() {
        const toast = document.getElementById('toast');
        toast.classList.remove('show');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.virtualClassroom = new VirtualClassroom();
});