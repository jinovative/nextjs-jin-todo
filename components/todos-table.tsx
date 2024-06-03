"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Spinner,
    Dropdown,
    DropdownTrigger,
    DropdownItem,
    DropdownMenu,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react";

import { VerticalDotsIcon } from "./icons";

import { CustomModalType, FocusedTodoType, Todo } from "@/types";
import { useRouter } from "next/navigation";
import CustomModal from "./custom-modal";

export const TodosTable = ({ todos }: { todos: Todo[] }) => {
    //input hover button
    const [todoAddEnable, setTodoAddEnable] = useState(false);
    const [newTodoInput, setNewTodoInput] = useState("");

    //loading UI
    const [isLoading, setIsLoading] = useState<boolean>(false);

    //Modal status
    const [currentModalData, setCurrentModalData] = useState<FocusedTodoType>({
        focusedTodo: null,
        modalType: "detail" as CustomModalType,
    });

    const router = useRouter();

    const notifySuccessEvent = (msg: string) => toast.success(msg);

    async function addATodoHandler() {
        if (newTodoInput.length < 1) {
            return;
        }
        {
            setIsLoading(true);
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/`, {
                cache: "no-store",
                method: "post",
                body: JSON.stringify({ title: newTodoInput }),
            });
            router.refresh();
            setTodoAddEnable(false);
            setIsLoading(false);
            notifySuccessEvent("Successfully Added!");
        }
    }
    async function editATodoHandler(
        id: string,
        editedTitle: string,
        editedIsDone: boolean
    ) {
        setIsLoading(true);
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/${id}`, {
            cache: "no-store",
            method: "post",
            body: JSON.stringify({
                title: editedTitle,
                is_done: editedIsDone,
            }),
        });
        setNewTodoInput("");
        router.refresh();
        setTodoAddEnable(false);
        setIsLoading(false);
        notifySuccessEvent("Successfully Edited!");
    }
    async function deleteATodoHandler(id: string) {
        setIsLoading(true);
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/${id}`, {
            cache: "no-store",
            method: "delete",
        });
        router.refresh();
        setIsLoading(false);
        notifySuccessEvent("Successfully Deleted!");
    }

    const applyIsDoneUI = (isDone: boolean): string => {
        return isDone ? "line-through text-gray-900/50 dark:text-white/40" : "";
    };

    const TodoRow = (aTodo: Todo) => {
        return (
            <TableRow key={aTodo.id}>
                <TableCell className={applyIsDoneUI(aTodo.is_done)}>
                    {aTodo.id.slice(0, 4)}
                </TableCell>
                <TableCell className={applyIsDoneUI(aTodo.is_done)}>
                    {aTodo.title}
                </TableCell>
                <TableCell>{aTodo.is_done ? "✅" : "📌"}</TableCell>
                <TableCell
                    className={applyIsDoneUI(aTodo.is_done)}
                >{`${aTodo.created_at}`}</TableCell>
                <TableCell>
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown className="bg-background border-1 border-default-200">
                            <DropdownTrigger>
                                <Button
                                    isIconOnly
                                    radius="full"
                                    size="sm"
                                    variant="light"
                                >
                                    <VerticalDotsIcon className="text-default-400" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                onAction={(key) => {
                                    setCurrentModalData({
                                        focusedTodo: aTodo,
                                        modalType: key as CustomModalType,
                                    });
                                    onOpen();
                                }}
                            >
                                <DropdownItem key="detail">View</DropdownItem>
                                <DropdownItem key="edit">Edit</DropdownItem>
                                <DropdownItem key="delete">Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </TableCell>
            </TableRow>
        );
    };

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const ModalComponent = () => {
        return (
            <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) =>
                        currentModalData.focusedTodo && (
                            <CustomModal
                                focusedTodo={currentModalData.focusedTodo}
                                modalType={currentModalData.modalType}
                                onClose={onClose}
                                onEdit={async (id, title, isDone) => {
                                    await editATodoHandler(id, title, isDone);
                                    onClose();
                                }}
                                onDelete={async (id) => {
                                    await deleteATodoHandler(id);
                                    onClose();
                                }}
                            />
                        )
                    }
                </ModalContent>
            </Modal>
        );
    };

    return (
        <div className="flex flex-col space-y-2">
            {ModalComponent()}
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />

            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                <Input
                    type="text"
                    label="Add Your Todo List"
                    value={newTodoInput}
                    onValueChange={(changedInput) => {
                        setNewTodoInput(changedInput);
                        setTodoAddEnable(changedInput.length > 0);
                    }}
                />
                {todoAddEnable ? (
                    <Button
                        color="primary"
                        className="h-14"
                        onPress={async () => {
                            await addATodoHandler();
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Spinner size="sm" color="white" />
                        ) : (
                            "Add"
                        )}
                    </Button>
                ) : (
                    <Popover placement="top" showArrow={true}>
                        <PopoverTrigger>
                            <Button color="warning" className="h-14" disabled>
                                Add
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="px-1 py-2 text-center">
                                <div className="text-small font-bold">
                                    Wooops!
                                </div>
                                <div className="text-tiny">DO SOMETHING!</div>
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
            </div>

            <Table isHeaderSticky aria-label="Todo Table">
                <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>Title</TableColumn>
                    <TableColumn>Complete</TableColumn>
                    <TableColumn>Date</TableColumn>
                    <TableColumn>Action</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No data to display."}>
                    {todos && todos.map((aTodo: Todo) => TodoRow(aTodo))}
                </TableBody>
            </Table>
        </div>
    );
};
