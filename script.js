// Módulo de formulario de artículos
//Gael Jovani Lopez Garcia 11916199
const ArticleForm = (() => {
    // Variables privadas
    let form, submitBtn, successMessage, formSection, newArticleBtn;
    let titleInput, summaryInput, authorInput, emailInput, keywordsInput, categorySelect;
    let titleError, summaryError, authorError, emailError, charCount;
    let searchInput, categoryFilter, articlesTable, articlesCount;
    let articles = [];
    let filteredArticles = [];
    let currentEditingId = null;
    let formData = {
        title: '',
        summary: '',
        author: '',
        email: '',
        keywords: '',
        category: ''
    };

    // Inicializar elementos del DOM
    const initializeElements = () => {
        form = document.getElementById('articleForm');
        submitBtn = document.getElementById('submitBtn');
        successMessage = document.getElementById('successMessage');
        formSection = document.querySelector('.form-section');
        newArticleBtn = document.getElementById('newArticleBtn');
        
        titleInput = document.getElementById('title');
        summaryInput = document.getElementById('summary');
        authorInput = document.getElementById('author');
        emailInput = document.getElementById('email');
        keywordsInput = document.getElementById('keywords');
        categorySelect = document.getElementById('category');
        
        titleError = document.getElementById('titleError');
        summaryError = document.getElementById('summaryError');
        authorError = document.getElementById('authorError');
        emailError = document.getElementById('emailError');
        charCount = document.getElementById('charCount');
        
        // Elementos de la tabla de artículos
        searchInput = document.getElementById('searchInput');
        categoryFilter = document.getElementById('categoryFilter');
        articlesTable = document.getElementById('articlesTable');
        articlesCount = document.getElementById('articlesCount');
    };

    // Configurar event listeners
    const initializeEventListeners = () => {
        // Validación en tiempo real
        titleInput.addEventListener('input', validateTitle);
        summaryInput.addEventListener('input', validateSummary);
        authorInput.addEventListener('input', validateAuthor);
        emailInput.addEventListener('input', validateEmail);
        
        // Contador de caracteres
        summaryInput.addEventListener('input', updateCharCount);
        
        // Envío del formulario
        form.addEventListener('submit', handleSubmit);
        
        // Reset del formulario
        form.addEventListener('reset', handleReset);
        
        // Botón para nuevo artículo
        newArticleBtn.addEventListener('click', resetForm);
        
        // Event listeners para actualización en tiempo real del botón
        titleInput.addEventListener('input', updateSubmitButton);
        summaryInput.addEventListener('input', updateSubmitButton);
        authorInput.addEventListener('input', updateSubmitButton);
        emailInput.addEventListener('input', updateSubmitButton);
        
        // Event listeners para búsqueda y filtro
        searchInput.addEventListener('input', filterArticles);
        categoryFilter.addEventListener('change', filterArticles);
        
        // Prevenir envío con Enter en campos específicos
        titleInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                summaryInput.focus();
            }
        });
        
        authorInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                emailInput.focus();
            }
        });
        
        emailInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                keywordsInput.focus();
            }
        });
        
        keywordsInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                categorySelect.focus();
            }
        });
    };

    // Validación del título
    const validateTitle = () => {
    const value = titleInput.value.trim();
    formData.title = value;
    
    if (value.length === 0) {
        showError(titleInput, titleError);
        return false;
    } else if (value.length < 5) {
        titleError.textContent = 'El título debe tener al menos 5 caracteres';
        showError(titleInput, titleError);
        return false;
    } else {
        hideError(titleInput, titleError);
        return true;
    }
}

    // Validación del resumen
    const validateSummary = () => {
    const value = summaryInput.value.trim();
    formData.summary = value;
    
    if (value.length === 0) {
        showError(summaryInput, summaryError);
        updateCharCount();
        return false;
    } else if (value.length < 50) {
        showError(summaryInput, summaryError);
        updateCharCount();
        return false;
    } else {
        hideError(summaryInput, summaryError);
        updateCharCount();
        return true;
    }
}

    // Validación del autor
    const validateAuthor = () => {
    const value = authorInput.value.trim();
    formData.author = value;
    
    if (value.length === 0) {
        showError(authorInput, authorError);
        return false;
    } else if (value.length < 3) {
        authorError.textContent = 'El nombre del autor debe tener al menos 3 caracteres';
        showError(authorInput, authorError);
        return false;
    } else {
        hideError(authorInput, authorError);
        return true;
    }
}

    // Validación del email
    const validateEmail = () => {
    const value = emailInput.value.trim();
    formData.email = value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (value.length === 0) {
        showError(emailInput, emailError);
        return false;
    } else if (!emailRegex.test(value)) {
        showError(emailInput, emailError);
        return false;
    } else {
        hideError(emailInput, emailError);
        return true;
    }
}

    // Actualizar contador de caracteres
    const updateCharCount = () => {
    const count = summaryInput.value.length;
    charCount.textContent = count;
    
    if (count >= 50) {
        charCount.parentElement.classList.add('valid');
        charCount.parentElement.classList.remove('invalid');
    } else {
        charCount.parentElement.classList.add('invalid');
        charCount.parentElement.classList.remove('valid');
    }
}

    // Mostrar error
    const showError = (input, errorElement) => {
    input.classList.add('error');
    input.classList.remove('valid');
    errorElement.classList.add('show');
}

    // Ocultar error
    const hideError = (input, errorElement) => {
    input.classList.remove('error');
    input.classList.add('valid');
    errorElement.classList.remove('show');
}

    // Actualizar estado del botón de envío
    const updateSubmitButton = () => {
    const isValid = validateTitle() && 
                   validateSummary() && 
                   validateAuthor() && 
                   validateEmail();
    
    submitBtn.disabled = !isValid;
}

    // Manejar envío del formulario
    const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validar todos los campos antes de enviar
    const isTitleValid = validateTitle();
    const isSummaryValid = validateSummary();
    const isAuthorValid = validateAuthor();
    const isEmailValid = validateEmail();
    
    if (!isTitleValid || !isSummaryValid || !isAuthorValid || !isEmailValid) {
        updateSubmitButton();
        return;
    }
    
    // Actualizar datos adicionales
    formData.keywords = keywordsInput.value.trim();
    formData.category = categorySelect.value;
    
    // Mostrar estado de carga
    showLoadingState();
    
    try {
        // Simular envío al servidor
        await submitArticle(formData);
        
        // Mostrar mensaje de éxito
        showSuccessMessage();
        
        // Limpiar formulario
        clearForm();
        
    } catch (error) {
        console.error('Error al enviar el artículo:', error);
        showErrorMessage('Ocurrió un error al registrar el artículo. Por favor, inténtelo nuevamente.');
    } finally {
        hideLoadingState();
    }
}

    // Simular envío del artículo
    const submitArticle = (data) => {
        return new Promise((resolve, reject) => {
            // Simular delay de red
            setTimeout(() => {
                try {
                    // Crear nuevo artículo
                    const newArticle = {
                        id: currentEditingId || Date.now().toString(),
                        ...data,
                        date: new Date().toLocaleDateString('es-ES'),
                        timestamp: new Date().toISOString()
                    };
                    
                    if (currentEditingId) {
                        // Actualizar artículo existente
                        const index = articles.findIndex(a => a.id === currentEditingId);
                        if (index !== -1) {
                            articles[index] = newArticle;
                        }
                        currentEditingId = null;
                    } else {
                        // Agregar nuevo artículo
                        articles.unshift(newArticle);
                    }
                    
                    console.log('Artículo guardado:', newArticle);
                    
                    // Actualizar visualización
                    filterArticles();
                    
                    resolve({ success: true, message: 'Artículo registrado exitosamente' });
                } catch (error) {
                    reject(error);
                }
            }, 1500);
        });
    };

    // Mostrar estado de carga
    const showLoadingState = () => {
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.btn-loading').style.display = 'inline-flex';
}

    // Ocultar estado de carga
    const hideLoadingState = () => {
    submitBtn.querySelector('.btn-text').style.display = 'inline';
    submitBtn.querySelector('.btn-loading').style.display = 'none';
    updateSubmitButton();
}

    // Mostrar mensaje de éxito
    const showSuccessMessage = () => {
    formSection.style.display = 'none';
    successMessage.style.display = 'block';
}

    // Mostrar mensaje de error
    const showErrorMessage = (message) => {
    // Crear elemento de error si no existe
    let errorDiv = document.querySelector('.error-alert');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-alert';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h4>Error</h4>
                <p>${message}</p>
                <button class="btn btn-secondary" onclick="this.parentElement.parentElement.remove()">Cerrar</button>
            </div>
        `;
        formSection.insertBefore(errorDiv, form);
        
        // Añadir estilos para la alerta de error
        const style = document.createElement('style');
        style.textContent = `
            .error-alert {
                background: #f8d7da;
                border: 1px solid #f5c6cb;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
                animation: slideIn 0.3s ease;
            }
            .error-content h4 {
                color: #721c24;
                margin-bottom: 10px;
            }
            .error-content p {
                color: #721c24;
                margin-bottom: 15px;
            }
        `;
        document.head.appendChild(style);
    }
}

    // Limpiar formulario
    const clearForm = () => {
        // Resetear formulario usando el método nativo
        form.reset();
        
        // Forzar limpieza de valores residuales
        titleInput.value = '';
        summaryInput.value = '';
        authorInput.value = '';
        emailInput.value = '';
        keywordsInput.value = '';
        categorySelect.value = '';
        
        // Resetear estado de validación
        document.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('error', 'valid');
        });
        
        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('show');
        });
        
        // Resetear contador de caracteres
        charCount.textContent = '0';
        charCount.parentElement.classList.remove('valid', 'invalid');
        
        // Resetear datos del formulario
        formData = {
            title: '',
            summary: '',
            author: '',
            email: '',
            keywords: '',
            category: ''
        };
        
        // Resetear estado de edición
        currentEditingId = null;
        submitBtn.querySelector('.btn-text').textContent = 'Registrar Artículo';
        
        // Forzar actualización del botón
        updateSubmitButton();
        
        console.log('Formulario limpiado completamente');
    };

    // Manejar reset del formulario
    const handleReset = (event) => {
    event.preventDefault();
    clearForm();
}

    // Función para registrar nuevo artículo (desde el mensaje de éxito)
    const resetForm = () => {
        successMessage.style.display = 'none';
        formSection.style.display = 'block';
        clearForm();
        
        // Hacer scroll al inicio del formulario
        formSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Funciones para manejo de artículos
    const filterArticles = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const categoryValue = categoryFilter.value;
        
        filteredArticles = articles.filter(article => {
            const matchesSearch = !searchTerm || 
                article.title.toLowerCase().includes(searchTerm) ||
                article.author.toLowerCase().includes(searchTerm) ||
                article.keywords.toLowerCase().includes(searchTerm);
            
            const matchesCategory = !categoryValue || article.category === categoryValue;
            
            return matchesSearch && matchesCategory;
        });
        
        renderArticles();
    };

    const renderArticles = () => {
        articlesCount.textContent = filteredArticles.length;
        
        if (filteredArticles.length === 0) {
            articlesTable.innerHTML = `
                <div class="no-articles">
                    <div class="no-articles-icon">📄</div>
                    <p>${articles.length === 0 ? 'No hay artículos registrados aún. Registra tu primer artículo para comenzar.' : 'No se encontraron artículos con los criterios de búsqueda.'}</p>
                </div>
            `;
            return;
        }
        
        const articlesHTML = filteredArticles.map(article => `
            <div class="article-item" data-id="${article.id}">
                <div class="article-header">
                    <h3 class="article-title">${escapeHtml(article.title)}</h3>
                    ${article.category ? `<span class="article-category">${getCategoryLabel(article.category)}</span>` : ''}
                </div>
                <div class="article-meta">
                    <div class="article-author">
                        <strong>Autor:</strong> ${escapeHtml(article.author)}
                    </div>
                    <div class="article-email">
                        <strong>Email:</strong> ${escapeHtml(article.email)}
                    </div>
                    <div class="article-date">
                        <strong>Fecha:</strong> ${article.date}
                    </div>
                </div>
                <div class="article-summary">
                    ${escapeHtml(article.summary)}
                </div>
                ${article.keywords ? `
                    <div class="article-keywords">
                        ${article.keywords.split(',').map(keyword => 
                            `<span class="keyword-tag">${escapeHtml(keyword.trim())}</span>`
                        ).join('')}
                    </div>
                ` : ''}
                <div class="article-actions">
                    <button class="btn-small btn-view" onclick="ArticleForm.viewArticle('${article.id}')">
                        Ver
                    </button>
                    <button class="btn-small btn-edit" onclick="ArticleForm.editArticle('${article.id}')">
                        Editar
                    </button>
                    <button class="btn-small btn-delete" onclick="ArticleForm.deleteArticle('${article.id}')">
                        Eliminar
                    </button>
                </div>
            </div>
        `).join('');
        
        articlesTable.innerHTML = articlesHTML;
    };

    const getCategoryLabel = (category) => {
        const categories = {
            'ciencias': 'Ciencias',
            'tecnologia': 'Tecnología',
            'educacion': 'Educación',
            'medicina': 'Medicina',
            'ingenieria': 'Ingeniería',
            'sociales': 'Ciencias Sociales',
            'artes': 'Artes y Humanidades',
            'otro': 'Otro'
        };
        return categories[category] || category;
    };

    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    const viewArticle = (id) => {
        const article = articles.find(a => a.id === id);
        if (!article) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">${escapeHtml(article.title)}</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="modal-meta">
                        <div class="modal-meta-item">
                            <strong>Autor:</strong> ${escapeHtml(article.author)}
                        </div>
                        <div class="modal-meta-item">
                            <strong>Email:</strong> ${escapeHtml(article.email)}
                        </div>
                        <div class="modal-meta-item">
                            <strong>Fecha:</strong> ${article.date}
                        </div>
                        ${article.category ? `
                            <div class="modal-meta-item">
                                <strong>Categoría:</strong> ${getCategoryLabel(article.category)}
                            </div>
                        ` : ''}
                        ${article.keywords ? `
                            <div class="modal-meta-item">
                                <strong>Palabras clave:</strong> ${escapeHtml(article.keywords)}
                            </div>
                        ` : ''}
                    </div>
                    <div class="modal-summary">
                        <h3>Resumen</h3>
                        <p>${escapeHtml(article.summary)}</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    };

    const editArticle = (id) => {
        const article = articles.find(a => a.id === id);
        if (!article) return;
        
        currentEditingId = id;
        
        // Llenar formulario con datos del artículo
        titleInput.value = article.title;
        summaryInput.value = article.summary;
        authorInput.value = article.author;
        emailInput.value = article.email;
        keywordsInput.value = article.keywords || '';
        categorySelect.value = article.category || '';
        
        // Actualizar validaciones
        validateTitle();
        validateSummary();
        validateAuthor();
        validateEmail();
        updateCharCount();
        updateSubmitButton();
        
        // Cambiar texto del botón
        submitBtn.querySelector('.btn-text').textContent = 'Actualizar Artículo';
        
        // Scroll al formulario
        formSection.scrollIntoView({ behavior: 'smooth' });
    };

    const deleteArticle = (id) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer.')) {
            return;
        }
        
        articles = articles.filter(a => a.id !== id);
        filterArticles();
        
        // Mostrar mensaje de éxito
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.display = 'block';
        successDiv.style.position = 'fixed';
        successDiv.style.top = '20px';
        successDiv.style.right = '20px';
        successDiv.style.zIndex = '1000';
        successDiv.style.maxWidth = '300px';
        successDiv.innerHTML = `
            <div class="success-content">
                <h4>Artículo Eliminado</h4>
                <p>El artículo ha sido eliminado exitosamente.</p>
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    };

    // Inicialización
    const init = () => {
        initializeElements();
        initializeEventListeners();
        updateSubmitButton();
        filterArticles(); // Inicializar la tabla de artículos
    };

    // Hacer públicas las funciones necesarias
    return {
        init,
        resetForm,
        viewArticle,
        editArticle,
        deleteArticle,
        filterArticles
    };
})();

// Inicialización global
document.addEventListener('DOMContentLoaded', () => {
    ArticleForm.init();
});

