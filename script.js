document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Add active state to clicked nav item
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);

  // Observe all step sections
  const stepSections = document.querySelectorAll('.step-section');
  stepSections.forEach(section => {
    observer.observe(section);
  });

  // Observe tool items for staggered animation
  const toolItems = document.querySelectorAll('.tool-item, .install-step, .db-container');
  toolItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
    observer.observe(item);
  });

  // Copy code functionality
  const codeBlocks = document.querySelectorAll('.code-block');
  
  codeBlocks.forEach(block => {
    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.innerHTML = '📋 Copy';
    copyButton.className = 'copy-button';
    copyButton.style.cssText = `
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #e2e8f0;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    
    // Make code block relative for absolute positioning
    block.style.position = 'relative';
    block.appendChild(copyButton);
    
    copyButton.addEventListener('click', async () => {
      const codeText = block.textContent.replace('📋 Copy', '').trim();
      
      try {
        await navigator.clipboard.writeText(codeText);
        copyButton.innerHTML = '✅ Copied!';
        copyButton.style.background = 'rgba(16, 185, 129, 0.2)';
        
        setTimeout(() => {
          copyButton.innerHTML = '📋 Copy';
          copyButton.style.background = 'rgba(255, 255, 255, 0.1)';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
        copyButton.innerHTML = '❌ Failed';
        
        setTimeout(() => {
          copyButton.innerHTML = '📋 Copy';
        }, 2000);
      }
    });
    
    copyButton.addEventListener('mouseenter', () => {
      copyButton.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    
    copyButton.addEventListener('mouseleave', () => {
      copyButton.style.background = 'rgba(255, 255, 255, 0.1)';
    });
  });

  // Progress indicator
  const createProgressIndicator = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(90deg, #2563eb, #f59e0b);
      z-index: 1000;
      transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    return progressBar;
  };

  const progressBar = createProgressIndicator();

  // Update progress on scroll
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    progressBar.style.width = scrollPercent + '%';
  });

  // Highlight current section in navigation
  const updateActiveNavigation = () => {
    const sections = document.querySelectorAll('.step-section');
    const navItems = document.querySelectorAll('.toc-item');
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= sectionTop - 100) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === '#' + currentSection) {
        item.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavigation);

  // Add hover effects to interactive elements
  const addHoverEffects = () => {
    const interactiveElements = document.querySelectorAll(
      '.tool-item, .install-step, .db-container, .verification-tool, .result-item'
    );
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'translateY(-2px)';
        element.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translateY(0)';
        element.style.boxShadow = '';
      });
    });
  };

  addHoverEffects();

  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });

  // Add CSS for keyboard navigation
  const keyboardStyles = document.createElement('style');
  keyboardStyles.textContent = `
    .keyboard-navigation *:focus {
      outline: 2px solid #2563eb !important;
      outline-offset: 2px !important;
    }
  `;
  document.head.appendChild(keyboardStyles);

  // Back to top button
  const createBackToTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: #2563eb;
      color: white;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    `;
    
    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(button);
    return button;
  };

  const backToTopButton = createBackToTopButton();

  // Show/hide back to top button
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton.style.opacity = '1';
      backToTopButton.style.visibility = 'visible';
    } else {
      backToTopButton.style.opacity = '0';
      backToTopButton.style.visibility = 'hidden';
    }
  });

  // Add loading animation to tech stack items
  const techItems = document.querySelectorAll('.tech-item');
  techItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.2}s`;
    item.classList.add('fade-in');
  });

  // Enhanced code block styling
  const enhanceCodeBlocks = () => {
    codeBlocks.forEach(block => {
      const lines = block.innerHTML.split('<br>');
      if (lines.length > 1) {
        const numberedLines = lines.map((line, index) => {
          return `<span class="line-number">${index + 1}</span>${line}`;
        }).join('<br>');
        
        block.innerHTML = numberedLines;
      }
    });
  };

  // Add line numbers CSS
  const lineNumberStyles = document.createElement('style');
  lineNumberStyles.textContent = `
    .line-number {
      display: inline-block;
      width: 2rem;
      color: #64748b;
      font-size: 0.8rem;
      margin-right: 1rem;
      text-align: right;
    }
  `;
  document.head.appendChild(lineNumberStyles);

  // Initialize enhanced features
  setTimeout(() => {
    enhanceCodeBlocks();
  }, 100);

  console.log('🚀 GUVI Setup Guide loaded successfully!');
});
