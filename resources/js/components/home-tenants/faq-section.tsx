import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    helpfulness?: number;
}

const faqData: FAQ[] = [
    {
        id: '1',
        question: '¿Cómo funciona la sincronización con Google Calendar?',
        answer: 'MiCita se sincroniza automáticamente con tu Google Calendar. Todas las citas programadas aparecerán en ambas plataformas en tiempo real, evitando conflictos de horarios.',
        category: 'Integraciones',
        helpfulness: 95,
    },
    {
        id: '2',
        question: '¿Puedo personalizar los recordatorios automáticos?',
        answer: 'Sí, puedes configurar recordatorios por email y WhatsApp con diferentes intervalos (24h, 2h, 30min antes). También puedes personalizar los mensajes según tu tipo de negocio.',
        category: 'Recordatorios',
        helpfulness: 88,
    },
    {
        id: '3',
        question: '¿Cómo funcionan las bases de datos separadas?',
        answer: 'Cada cliente tiene su propia base de datos aislada, garantizando máxima seguridad y privacidad. Esto es ideal para profesionales que manejan información sensible.',
        category: 'Seguridad',
        helpfulness: 92,
    },
    {
        id: '4',
        question: '¿Las videollamadas se generan automáticamente?',
        answer: 'Sí, para servicios online, MiCita genera automáticamente enlaces de videollamada únicos que se envían tanto al profesional como al cliente antes de la cita.',
        category: 'Videollamadas',
        helpfulness: 85,
    },
    {
        id: '5',
        question: '¿Puedo configurar diferentes precios por profesional?',
        answer: 'Absolutamente. Cada profesional puede tener precios y duraciones personalizadas para cada servicio, además de su propia disponibilidad y excepciones.',
        category: 'Configuración',
        helpfulness: 90,
    },
    {
        id: '6',
        question: '¿Qué sucede si un cliente no confirma su cita?',
        answer: 'El sistema envía recordatorios automáticos y permite configurar políticas de cancelación. Los clientes pueden confirmar, cancelar o reprogramar desde su portal personal.',
        category: 'Gestión',
        helpfulness: 87,
    },
];

export function FAQSection() {
    const [openItems, setOpenItems] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = ['Todos', ...new Set(faqData.map((faq) => faq.category))];

    const filteredFaqs = selectedCategory && selectedCategory !== 'Todos' ? faqData.filter((faq) => faq.category === selectedCategory) : faqData;

    const handleAccordionChange = (value: string[]) => {
        setOpenItems(value);
    };

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category === selectedCategory ? null : category);
        setOpenItems([]); // Opcional: cerrar todos los acordeones al cambiar categoría
    };

    return (
        <section className="bg-muted/30 px-4 py-20" id="faq">
            <div className="container mx-auto">
                <div className="mb-16 text-center">
                    <Badge className="mb-4 border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Preguntas Frecuentes
                    </Badge>
                    <h2 className="mb-4 font-outfit text-4xl font-bold">¿Tienes Dudas? Te Ayudamos</h2>
                    <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                        Encuentra respuestas rápidas a las preguntas más comunes sobre MiCita
                    </p>
                </div>

                <div className="mx-auto max-w-4xl">
                    <div className="mb-8 flex flex-wrap justify-center gap-2">
                        {categories.map((category) => (
                            <Badge
                                key={category}
                                variant={category === selectedCategory || (category === 'Todos' && !selectedCategory) ? 'default' : 'outline'}
                                className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                                onClick={() => handleCategoryClick(category)}
                            >
                                {category}
                            </Badge>
                        ))}
                    </div>

                    {filteredFaqs.length === 0 ? (
                        <div className="rounded-lg border bg-card p-6 text-center">
                            <p className="text-muted-foreground">No hay preguntas disponibles para esta categoría.</p>
                        </div>
                    ) : (
                        <Accordion type="multiple" value={openItems} onValueChange={handleAccordionChange} className="space-y-4">
                            {filteredFaqs.map((faq) => (
                                <AccordionItem
                                    key={faq.id}
                                    value={faq.id}
                                    className="rounded-lg border bg-card px-6 transition-colors hover:bg-accent/50"
                                >
                                    <AccordionTrigger className="py-6 text-left hover:no-underline">
                                        <div className="flex w-full items-start justify-between pr-4">
                                            <div>
                                                <h3 className="mb-2 font-outfit text-lg font-semibold">{faq.question}</h3>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {faq.category}
                                                    </Badge>
                                                    {faq.helpfulness && (
                                                        <span className="text-xs text-muted-foreground">{faq.helpfulness}% útil</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6">
                                        <div className="space-y-4">
                                            <p className="leading-relaxed text-muted-foreground">{faq.answer}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </div>
            </div>
        </section>
    );
}
