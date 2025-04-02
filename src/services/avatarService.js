// avatarService.js - Service to manage avatar state and behavior
class AvatarService {
    constructor() {
      this.currentState = {
        emotion: 'neutral',
        message: null,
        isVisible: false,
        actionOptions: [],
        context: null
      };
      
      this.subscribers = [];
      this.messageQueue = [];
      this.userContext = {};
      this.processingQueue = false;
    }
    
    // Subscribe to state changes
    subscribe(callback) {
      this.subscribers.push(callback);
      return () => {
        this.subscribers = this.subscribers.filter(cb => cb !== callback);
      };
    }
    
    // Update all subscribers
    notifySubscribers() {
      this.subscribers.forEach(callback => callback(this.currentState));
    }
    
    // Show avatar with specific emotion and message
    show(options = {}) {
      this.currentState = {
        ...this.currentState,
        isVisible: true,
        ...options
      };
      this.notifySubscribers();
    }
    
    // Hide the avatar
    hide() {
      this.currentState = {
        ...this.currentState,
        isVisible: false,
        message: null
      };
      this.notifySubscribers();
    }
    
    // Queue a message to be shown
    queueMessage(message, options = {}) {
      this.messageQueue.push({
        message,
        ...options
      });
      
      if (!this.processingQueue) {
        this.processMessageQueue();
      }
    }
    
    // Process queued messages
    async processMessageQueue() {
      if (this.messageQueue.length === 0) {
        this.processingQueue = false;
        return;
      }
      
      this.processingQueue = true;
      const nextMessage = this.messageQueue.shift();
      
      this.show({
        message: nextMessage.message,
        emotion: nextMessage.emotion || 'neutral',
        actionOptions: nextMessage.actionOptions || []
      });
      
      // If duration specified, hide after duration
      if (nextMessage.duration) {
        await new Promise(resolve => setTimeout(resolve, nextMessage.duration));
        this.processMessageQueue();
      }
    }
    
    // Handle user context updates
    updateUserContext(contextData) {
      this.userContext = {
        ...this.userContext,
        ...contextData
      };
      
      // Trigger contextual behaviors based on updated context
      this.evaluateContext();
    }
    
    // Evaluate current context and determine if avatar should respond
    evaluateContext() {
      // Example contextual triggers
      if (this.userContext.isNewUser && !this.userContext.completedOnboarding) {
        this.queueMessage(
          "Welcome to GradeGear! I'm Kathakali, your study guide. Would you like a quick tour?",
          {
            emotion: 'happy',
            actionOptions: [
              { type: 'startTour', label: 'Show me around', primary: true },
              { type: 'dismiss', label: 'Maybe later' }
            ]
          }
        );
      }
      
      if (this.userContext.currentPage === 'lectures' && !this.userContext.hasViewedLecture) {
        this.queueMessage(
          "Looking for study materials? You can filter lectures by semester and subject using the options on the left.",
          {
            emotion: 'explaining',
            duration: 8000
          }
        );
      }
      
      if (this.userContext.lowGrades && this.userContext.lowGrades.length > 0) {
        const subject = this.userContext.lowGrades[0];
        this.queueMessage(
          `I noticed you might be struggling with ${subject}. Would you like me to recommend some helpful resources?`,
          {
            emotion: 'thinking',
            actionOptions: [
              { type: 'showResources', label: 'Show resources', primary: true },
              { type: 'dismiss', label: 'No thanks' }
            ]
          }
        );
      }
    }
    
    // Handle user achievements
    celebrateAchievement(achievement) {
      let message = '';
      
      switch (achievement.type) {
        case 'gradeImprovement':
          message = `Great job improving your ${achievement.subject} grade! Keep up the good work!`;
          break;
        case 'completedCourse':
          message = `Congratulations on completing ${achievement.course}! That's a significant milestone!`;
          break;
        case 'streakMilestone':
          message = `You've studied for ${achievement.days} days in a row! Your dedication is impressive!`;
          break;
        default:
          message = 'Congratulations on your achievement!';
      }
      
      this.queueMessage(message, {
        emotion: 'celebrating',
        duration: 5000
      });
    }
  }
  
  export const avatarService = new AvatarService();
  export default avatarService;