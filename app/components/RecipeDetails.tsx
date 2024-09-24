import { Fragment } from "react";
import Image from "next/image";

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";

import { RecipeDetailsProps } from "@/app/types";

const RecipeDetails = ({ isOpen, closeModal, recipe }: RecipeDetailsProps) => (
  <>
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-out duration-300"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all flex flex-col gap-5">
                <button
                  type="button"
                  className="absolute top-2 right-2 z-10 w-fit p-2 bg-primary-red-100 rounded-full"
                  onClick={closeModal}
                >
                  <Image
                    src="/close.svg"
                    alt="close"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </button>
                <Image
                  src={recipe.image}
                  alt={recipe.recipe}
                  className="recipe-image"
                  width={200}
                  height={200}
                />
                <div className="flex items-center justify-between w-full">
                  <div className="recipe-infobox">
                    <Image
                      src="/person.svg"
                      alt="person icon"
                      width={30}
                      height={30}
                    />
                    {recipe.serving}{" "}
                    {recipe.serving === 1 ? "serving" : "servings"}
                  </div>
                  <div className="recipe-infobox">
                    <p>
                      {recipe.cook_time_in_minutes === 0
                        ? recipe.prep_time_in_minutes
                        : recipe.cook_time_in_minutes}{" "}
                      min
                    </p>
                  </div>
                  <div className="recipe-infobox">
                    <p>{recipe.category.category}</p>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  </>
);

export default RecipeDetails;
