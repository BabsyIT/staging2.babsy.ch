class ContentLoader {
    constructor() {
        this.contentCache = {};
    }

    async loadMarkdownFile(filename) {
        if (this.contentCache[filename]) {
            return this.contentCache[filename];
        }

        try {
            const response = await fetch(`content/${filename}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            this.contentCache[filename] = content;
            return content;
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
            return '';
        }
    }

    async loadAllContent() {
        const contentFiles = {
            hero: 'hero.md',
            about: 'about.md',
            vision: 'vision.md',
            mission: 'mission.md',
            team: 'team.md',
            testimonials: 'testimonials.md',
            contact: 'contact.md',
            footer: 'footer.md'
        };

        const content = {};
        
        for (const [key, filename] of Object.entries(contentFiles)) {
            content[key] = await this.loadMarkdownFile(filename);
        }

        return this.parseContent(content);
    }

    parseContent(rawContent) {
        return {
            navigation: [
                { href: '#home', text: 'Home' },
                { href: '#about', text: 'Über uns' },
                { href: '#services', text: 'Services' },
                { href: '#team', text: 'Team' },
                { href: '#support', text: 'Unterstützung' },
                { href: '#contact', text: 'Kontakt' }
            ],
            navigation_cta: 'Jetzt registrieren',
            
            hero: this.parseHero(rawContent.hero),
            about: this.parseAbout(rawContent.about),
            vision: this.parseVisionMission(rawContent.vision, 'Vision'),
            mission: this.parseVisionMission(rawContent.mission, 'Mission'),
            team: this.parseTeam(rawContent.team),
            contact: this.parseContact(rawContent.contact),
            
            // Statische Inhalte (können später auch in Markdown ausgelagert werden)
            quote: '"Babsy macht es einfach, aber Babsy macht es auch sicher."',
            app: {
                title: 'Unsere Babsy App',
                subtitle: 'Für Android & iOS verfügbar',
                features: [
                    {
                        title: 'Mobile First',
                        description: 'Optimiert für die Nutzung auf Smartphones - immer und überall verfügbar',
                        icon: '<svg class="w-8 h-8 text-babsypurple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>'
                    },
                    {
                        title: 'Geprüfte Nutzer',
                        description: 'Alle Babysitter und Eltern werden von uns überprüft für maximale Sicherheit',
                        icon: '<svg class="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
                    },
                    {
                        title: 'Schnelle Vermittlung',
                        description: 'Finde in wenigen Minuten verfügbare Babysitter in deiner Nähe',
                        icon: '<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>'
                    }
                ],
                stores: [
                    {
                        name: 'Google Play',
                        url: 'https://play.google.com/store/apps/details?id=ch.babsy.babsyapp&hl=de_CH',
                        image: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg'
                    },
                    {
                        name: 'App Store',
                        url: 'https://apps.apple.com/ch/app/babsy/id1584418581',
                        image: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg'
                    }
                ]
            }
        };
    }

    parseHero(content) {
        const lines = content.split('\n');
        return {
            title: this.extractValue(lines, 'title') || 'sicher. schnell. seriös',
            subtitle: this.extractValue(lines, 'subtitle') || 'safe. swift. secure',
            description: this.extractValue(lines, 'description') || 'Die neue Welt der Kinderbetreuung',
            cta_primary: this.extractValue(lines, 'cta_primary') || 'Jetzt registrieren',
            cta_secondary: this.extractValue(lines, 'cta_secondary') || 'Sign up now',
            image: this.extractValue(lines, 'image') || 'assets/images/babsy-dorf-jung.png',
            image_alt: this.extractValue(lines, 'image_alt') || 'Babsy Kinderbetreuung'
        };
    }

    parseAbout(content) {
        const sections = content.split('---');
        return {
            title: 'Was ist Babsy?',
            subtitle: 'Wir stellen uns vor',
            section_title: 'Über Babsy',
            content: sections[0]?.trim() || '',
            stats: this.parseStats(sections[1])
        };
    }

    parseStats(statsContent) {
        if (!statsContent) return [];
        
        const lines = statsContent.split('\n');
        const stats = [];
        
        lines.forEach(line => {
            const match = line.match(/(\d+\+?|24\/7|\d{4}): (.+)/);
            if (match) {
                stats.push({
                    number: match[1],
                    label: match[2]
                });
            }
        });
        
        return stats;
    }

    parseVisionMission(content, title) {
        return {
            title,
            content: content.trim()
        };
    }

    parseTeam(content) {
        const members = [];
        const memberSections = content.split('---');
        
        memberSections.forEach(section => {
            const lines = section.trim().split('\n');
            if (lines.length > 0) {
                const member = {
                    name: this.extractValue(lines, 'name'),
                    position: this.extractValue(lines, 'position'),
                    image: this.extractValue(lines, 'image'),
                    phone: this.extractValue(lines, 'phone')
                };
                
                if (member.name) {
                    members.push(member);
                }
            }
        });

        return {
            title: 'Die Gründer',
            subtitle: 'Engagierte Menschen mit einer Vision',
            members
        };
    }

    parseContact(content) {
        return {
            title: 'Kontakt',
            subtitle: 'Wir sind für Sie da',
            info: [
                {
                    title: 'Besuche uns',
                    icon: '<svg class="w-6 h-6 text-babsypurple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>',
                    content: content
                }
            ]
        };
    }

    extractValue(lines, key) {
        const line = lines.find(l => l.startsWith(`${key}:`));
        return line ? line.substring(key.length + 1).trim() : null;
    }
}
