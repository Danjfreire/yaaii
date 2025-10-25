'use client';

import { useRef, useState, KeyboardEvent } from 'react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
    const contentEditableRef = useRef<HTMLDivElement>(null);
    const [isEmpty, setIsEmpty] = useState(true);

    const getPlainText = (element: HTMLDivElement): string => {
        return element.innerText || element.textContent || '';
    };

    const handleSend = () => {
        if (!contentEditableRef.current || disabled) return;

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
                    contentEditable={!disabled}
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    className={`
                        min-h-11 max-h-32 overflow-y-auto
                        px-4 py-3 
                        border border-gray-300 dark:border-gray-600 
                        rounded-lg 
                        focus:outline-none focus:ring-1 focus:ring-gray-700 dark:focus:ring-gray-400
                        dark:dark:bg-[#303030] dark:text-white 
                        resize-none
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    style={{
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap'
                    }}
                    suppressContentEditableWarning={true}
                />
                {isEmpty && (
                    <div className="absolute left-4 top-3 text-gray-500 pointer-events-none">
                        Send a message
                    </div>
                )}
            </div>
        </div>
    );
}