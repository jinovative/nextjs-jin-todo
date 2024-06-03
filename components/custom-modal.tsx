"use client";

import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
    Button,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Checkbox,
    Link,
    Input,
    ModalContent,
    Modal,
    Switch,
    Spinner,
    CircularProgress,
} from "@nextui-org/react";

import { CustomModalType, FocusedTodoType, Todo } from "@/types";

export default function CustomModal({
    focusedTodo,
    modalType,
    onClose,
    onEdit,
    onDelete,
}: {
    focusedTodo: Todo;
    modalType: CustomModalType;
    onClose: () => void;
    onEdit: (id: string, title: string, isDone: boolean) => void;
    onDelete: (id: string) => void;
}) {
    //select to edit
    const [isDone, setIsDone] = useState(focusedTodo.is_done);

    //select to input the title
    const [editedTodoInput, setEditedTodoInput] = useState<string>(
        focusedTodo.title
    );

    const [isLoading, setIsLoading] = useState(false);

    const DetailModal = (todo: Todo) => {
        return (
            <>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Todo's Details
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    <span className="font-bold">id: </span>
                                    {focusedTodo.id}
                                </p>
                                <p>
                                    <span className="font-bold">title: </span>
                                    {focusedTodo.title}
                                </p>

                                <div className="flex py-2 px-1 space-x-4">
                                    <span className="font-bold">Status: </span>

                                    {`${isDone ? "Complete!" : "Not Yet"}`}
                                </div>
                                <div className="flex py-2 px-1 space-x-4">
                                    <span className="font-bold">Date:</span>
                                    <p>{`${focusedTodo.created_at}`}</p>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </>
        );
    };

    const EditModal = (todo: Todo) => {
        return (
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Edit Title
                        </ModalHeader>
                        <ModalBody>
                            <p>
                                <span className="font-bold">id:</span>
                                {focusedTodo.id}
                            </p>
                            <Input
                                autoFocus
                                label="Title Detail"
                                placeholder="Enter Title"
                                variant="bordered"
                                defaultValue={focusedTodo.title}
                                value={editedTodoInput}
                                onValueChange={setEditedTodoInput}
                            />

                            <div className="flex py-2 px-1 space-x-4">
                                <span className="font-bold">Are You Done?</span>
                                <Switch
                                    defaultSelected={focusedTodo.is_done}
                                    isSelected={isDone}
                                    onValueChange={setIsDone}
                                    aria-label="Automatic updates"
                                ></Switch>
                                {`${isDone ? "Complete!" : "Not Yet"}`}
                            </div>
                            <div className="flex py-2 px-1 space-x-4">
                                <span className="font-bold">Date:</span>
                                <p>{`${focusedTodo.created_at}`}</p>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="flat"
                                onPress={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onPress={() => {
                                    setIsLoading(true);
                                    onEdit(
                                        focusedTodo.id,
                                        editedTodoInput,
                                        isDone
                                    );
                                }}
                            >
                                {isLoading ? (
                                    <CircularProgress
                                        size="sm"
                                        color="default"
                                    />
                                ) : (
                                    "Edit"
                                )}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        );
    };

    const DeleteModal = (todo: Todo) => {
        return (
            <>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Do You Want To Delete this?
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    <span className="font-bold">id: </span>
                                    {focusedTodo.id}
                                </p>
                                <p>
                                    <span className="font-bold">title: </span>
                                    {focusedTodo.title}
                                </p>

                                <div className="flex py-2 px-1 space-x-4">
                                    <span className="font-bold">Status: </span>

                                    {`${isDone ? "Complete!" : "Not Yet"}`}
                                </div>
                                <div className="flex py-2 px-1 space-x-4">
                                    <span className="font-bold">Date:</span>
                                    <p>{`${focusedTodo.created_at}`}</p>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="primary"
                                    variant="flat"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={() => {
                                        setIsLoading(true);
                                        onDelete(focusedTodo.id);
                                    }}
                                >
                                    {isLoading ? (
                                        <CircularProgress
                                            size="sm"
                                            color="default"
                                        />
                                    ) : (
                                        "Delete"
                                    )}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </>
        );
    };

    const getModal = (type: CustomModalType) => {
        switch (type) {
            case "detail":
                return DetailModal(focusedTodo);
            case "edit":
                return EditModal(focusedTodo);
            case "delete":
                return DeleteModal(focusedTodo);
            default:
                break;
        }
    };
    return <>{getModal(modalType)}</>;
}
