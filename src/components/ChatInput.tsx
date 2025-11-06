'use client';

import { useRef, useState, KeyboardEvent } from 'react';
import { ArrowRight } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
    isLoading?: boolean;
    minHeight?: string;
    maxHeight?: string;
    placeholder?: string;
}

export default function ChatInput({
    onSendMessage,
    disabled = false,
    isLoading = false,
    minHeight = 'min-h-11',
    maxHeight = 'max-h-32',
    placeholder = 'Send a message'
}: ChatInputProps) {
    const contentEditableRef = useRef<HTMLDivElement>(null);
    const [isEmpty, setIsEmpty] = useState(true);

    const getPlainText = (element: HTMLDivElement): string => {
        return element.innerText || element.textContent || '';
    };

    const handleSend = () => {
        if (!contentEditableRef.current || disabled || isLoading) return;

        const text = getPlainText(contentEditableRef.current).trim();
        if (!text) {
            return
        }
        onSendMessage(text);
        contentEditableRef.current.innerHTML = '';
        setIsEmpty(true);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = () => {
        if (!contentEditableRef.current) return;

        const text = getPlainText(contentEditableRef.current).trim();
        setIsEmpty(!text);
    };

    return (
        <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
                <div
                    ref={contentEditableRef}
                    contentEditable={!disabled && !isLoading}
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    className={`
                        ${minHeight} ${maxHeight} overflow-y-auto
                        px-4 py-3 pr-12
                        border border-gray-300 dark:border-gray-600 
                        rounded-lg 
                        focus:outline-none focus:ring-1 focus:ring-gray-700 dark:focus:ring-gray-400
                        dark:bg-[#303030] dark:text-white 
                        resize-none
                        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    style={{
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap'
                    }}
                    suppressContentEditableWarning={true}
                />
                {isEmpty && (
                    <div className="absolute left-4 top-3 text-gray-500 pointer-events-none">
                        {placeholder}
                    </div>
                )}
            </div>
        </div>
    );
}